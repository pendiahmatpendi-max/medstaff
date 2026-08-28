import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

import { CreateLeaveDto } from './dto/create-leave.dto';

@Injectable()
export class LeaveService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  // =====================================================
  // GET EMPLOYEE
  // =====================================================

  private async getEmployee(userId: string) {
    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan belum tersedia untuk akun ini',
      );
    }

    return employee;
  }

  // =====================================================
  // STAFF - CREATE LEAVE
  // =====================================================

  async create(
    userId: string,
    dto: CreateLeaveDto,
  ) {
    const employee =
      await this.getEmployee(userId);

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (isNaN(startDate.getTime())) {
      throw new BadRequestException(
        'Tanggal mulai tidak valid',
      );
    }

    if (isNaN(endDate.getTime())) {
      throw new BadRequestException(
        'Tanggal selesai tidak valid',
      );
    }

    if (endDate < startDate) {
      throw new BadRequestException(
        'Tanggal selesai tidak boleh sebelum tanggal mulai',
      );
    }

    // ===================================================
    // CEK PENGAJUAN BENTROK
    // ===================================================

    const overlapping =
      await this.prisma.leaveRequest.findFirst({
        where: {
          employeeId: employee.id,

          status: {
            in: [
              'PENDING',
              'APPROVED',
            ],
          },

          startDate: {
            lte: endDate,
          },

          endDate: {
            gte: startDate,
          },
        },
      });

    if (overlapping) {
      throw new BadRequestException(
        'Sudah terdapat pengajuan izin pada tanggal tersebut',
      );
    }

    // ===================================================
    // CREATE LEAVE
    // ===================================================

    const leave =
      await this.prisma.leaveRequest.create({
        data: {
          employeeId: employee.id,
          leaveType: dto.type,
          startDate,
          endDate,
          reason: dto.reason,
          attachment: dto.attachment,
          status: 'PENDING',
        },

        include: {
          employee: {
            select: {
              employeeId: true,
              fullName: true,
              position: true,
              profilePhoto: true,
            },
          },
        },
      });

    // ===================================================
    // NOTIFICATION UNTUK ADMIN
    // ===================================================

    const admins =
      await this.prisma.user.findMany({
        where: {
          role: 'ADMIN',
          isActive: true,
        },

        select: {
          id: true,
        },
      });

    for (const admin of admins) {
      await this.notificationService.createNotification(
        admin.id,
        'Pengajuan Izin Baru',
        `${employee.fullName} mengajukan ${dto.type} dari ${dto.startDate} sampai ${dto.endDate}.`,
        'LEAVE_REQUEST',
        leave.id,
      );
    }

    return {
      success: true,
      message: 'Pengajuan izin berhasil dibuat',
      data: leave,
    };
  }

  // =====================================================
  // STAFF - MY LEAVES
  // =====================================================

  async getMyLeaves(
    userId: string,
  ) {
    const employee =
      await this.getEmployee(userId);

    const leaves =
      await this.prisma.leaveRequest.findMany({
        where: {
          employeeId: employee.id,
        },

        orderBy: {
          createdAt: 'desc',
        },

        include: {
          employee: {
            select: {
              employeeId: true,
              fullName: true,
              position: true,
              profilePhoto: true,
            },
          },

          reviewer: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

    return {
      success: true,
      message:
        'Riwayat pengajuan izin berhasil diambil',
      data: leaves,
    };
  }

  // =====================================================
  // STAFF - DETAIL
  // =====================================================

  async getMyLeaveById(
    userId: string,
    leaveId: string,
  ) {
    const employee =
      await this.getEmployee(userId);

    const leave =
      await this.prisma.leaveRequest.findFirst({
        where: {
          id: leaveId,
          employeeId: employee.id,
        },

        include: {
          reviewer: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

    if (!leave) {
      throw new NotFoundException(
        'Pengajuan izin tidak ditemukan',
      );
    }

    return {
      success: true,
      message:
        'Detail pengajuan izin berhasil diambil',
      data: leave,
    };
  }

  // =====================================================
  // ADMIN - GET ALL
  // =====================================================

  async getAll() {
    const leaves =
      await this.prisma.leaveRequest.findMany({
        orderBy: {
          createdAt: 'desc',
        },

        include: {
          employee: {
            select: {
              id: true,
              employeeId: true,
              fullName: true,
              position: true,
              companyName: true,
              profilePhoto: true,
            },
          },

          reviewer: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

    return {
      success: true,
      message:
        'Daftar pengajuan izin berhasil diambil',
      data: leaves,
    };
  }

  // =====================================================
  // ADMIN - APPROVE
  // =====================================================

  async approve(
    adminUserId: string,
    leaveId: string,
    adminNote?: string,
  ) {
    const leave =
      await this.prisma.leaveRequest.findUnique({
        where: {
          id: leaveId,
        },

        include: {
          employee: {
            select: {
              id: true,
              userId: true,
              employeeId: true,
              fullName: true,
            },
          },
        },
      });

    if (!leave) {
      throw new NotFoundException(
        'Pengajuan izin tidak ditemukan',
      );
    }

    if (leave.status !== 'PENDING') {
      throw new BadRequestException(
        'Pengajuan izin sudah diproses',
      );
    }

    // ===================================================
    // UPDATE
    // ===================================================

    const updated =
      await this.prisma.leaveRequest.update({
        where: {
          id: leaveId,
        },

        data: {
          status: 'APPROVED',
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
          adminNote,
        },

        include: {
          employee: {
            select: {
              employeeId: true,
              fullName: true,
              position: true,
              companyName: true,
              profilePhoto: true,
            },
          },

          reviewer: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

    // ===================================================
    // NOTIFICATION STAFF
    // ===================================================

    await this.notificationService.createNotification(
      leave.employee.userId,
      'Pengajuan Izin Disetujui',
      `Pengajuan ${leave.leaveType} dari ${leave.startDate.toISOString().slice(0, 10)} sampai ${leave.endDate.toISOString().slice(0, 10)} telah disetujui.`,
      'LEAVE_APPROVED',
      leave.id,
    );

    return {
      success: true,
      message:
        'Pengajuan izin berhasil disetujui',
      data: updated,
    };
  }

  // =====================================================
  // ADMIN - REJECT
  // =====================================================

  async reject(
    adminUserId: string,
    leaveId: string,
    adminNote?: string,
  ) {
    const leave =
      await this.prisma.leaveRequest.findUnique({
        where: {
          id: leaveId,
        },

        include: {
          employee: {
            select: {
              id: true,
              userId: true,
              employeeId: true,
              fullName: true,
            },
          },
        },
      });

    if (!leave) {
      throw new NotFoundException(
        'Pengajuan izin tidak ditemukan',
      );
    }

    if (leave.status !== 'PENDING') {
      throw new BadRequestException(
        'Pengajuan izin sudah diproses',
      );
    }

    // ===================================================
    // UPDATE
    // ===================================================

    const updated =
      await this.prisma.leaveRequest.update({
        where: {
          id: leaveId,
        },

        data: {
          status: 'REJECTED',
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
          adminNote,
        },

        include: {
          employee: {
            select: {
              employeeId: true,
              fullName: true,
              position: true,
              companyName: true,
              profilePhoto: true,
            },
          },

          reviewer: {
            select: {
              id: true,
              email: true,
              role: true,
            },
          },
        },
      });

    // ===================================================
    // NOTIFICATION STAFF
    // ===================================================

    await this.notificationService.createNotification(
      leave.employee.userId,
      'Pengajuan Izin Ditolak',
      `Pengajuan ${leave.leaveType} dari ${leave.startDate.toISOString().slice(0, 10)} sampai ${leave.endDate.toISOString().slice(0, 10)} telah ditolak.${adminNote ? ` Catatan admin: ${adminNote}` : ''}`,
      'LEAVE_REJECTED',
      leave.id,
    );

    return {
      success: true,
      message:
        'Pengajuan izin berhasil ditolak',
      data: updated,
    };
  }
}