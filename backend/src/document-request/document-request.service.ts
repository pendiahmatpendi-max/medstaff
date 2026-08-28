import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { ReviewDocumentRequestDto } from './dto/review-document-request.dto';

@Injectable()
export class DocumentRequestService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =========================
  // HELPER
  // =========================

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

  // =========================
  // STAFF - CREATE
  // =========================

  async create(
    userId: string,
    dto: CreateDocumentRequestDto,
  ) {
    const employee =
      await this.getEmployee(userId);

    const request =
      await this.prisma.documentChangeRequest.create({
        data: {
          employeeId: employee.id,
          requestType: dto.requestType,
          description: dto.description,
          oldData: dto.oldData,
          newData: dto.newData,
          attachment: dto.attachment,
          status: 'PENDING',
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
        },
      });

    return {
      success: true,
      message: 'Permintaan perubahan data berhasil dibuat',
      data: request,
    };
  }

  // =========================
  // STAFF - MY REQUESTS
  // =========================

  async getMyRequests(userId: string) {
    const employee =
      await this.getEmployee(userId);

    const requests =
      await this.prisma.documentChangeRequest.findMany({
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
      message: 'Riwayat permintaan perubahan data berhasil diambil',
      data: requests,
    };
  }

  // =========================
  // STAFF - DETAIL
  // =========================

  async getMyRequestById(
    userId: string,
    requestId: string,
  ) {
    const employee =
      await this.getEmployee(userId);

    const request =
      await this.prisma.documentChangeRequest.findFirst({
        where: {
          id: requestId,
          employeeId: employee.id,
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

    if (!request) {
      throw new NotFoundException(
        'Permintaan perubahan data tidak ditemukan',
      );
    }

    return {
      success: true,
      message: 'Detail permintaan perubahan data berhasil diambil',
      data: request,
    };
  }

  // =========================
  // ADMIN - ALL
  // =========================

  async getAll() {
    const requests =
      await this.prisma.documentChangeRequest.findMany({
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
      message: 'Daftar permintaan perubahan data berhasil diambil',
      data: requests,
    };
  }

  // =========================
  // ADMIN - REVIEW
  // =========================

  async review(
    adminUserId: string,
    requestId: string,
    dto: ReviewDocumentRequestDto,
  ) {
    const request =
      await this.prisma.documentChangeRequest.findUnique({
        where: {
          id: requestId,
        },
      });

    if (!request) {
      throw new NotFoundException(
        'Permintaan perubahan data tidak ditemukan',
      );
    }

    if (request.status !== 'PENDING') {
      throw new BadRequestException(
        'Permintaan perubahan data sudah diproses',
      );
    }

    const updated =
      await this.prisma.documentChangeRequest.update({
        where: {
          id: requestId,
        },

        data: {
          status: dto.status,
          reviewedBy: adminUserId,
          reviewedAt: new Date(),
          adminNote: dto.adminNote,
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
        dto.status === 'APPROVED'
          ? 'Permintaan perubahan data berhasil disetujui'
          : 'Permintaan perubahan data berhasil ditolak',
      data: updated,
    };
  }
}
