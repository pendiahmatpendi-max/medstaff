import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

import { CreateActivityDto } from './dto/create-activity.dto';
import { AttendActivityDto } from './dto/attend-activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  private getJakartaDate(date = new Date()) {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }

  private dateOnlyToUtc(dateOnly: string) {
    return new Date(`${dateOnly}T00:00:00.000Z`);
  }

  private getDateOnlyFromUtc(date: Date) {
    return date.toISOString().slice(0, 10);
  }

  private getJakartaNowTime() {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  }

  private timeToMinutes(time: string) {
    const [hour, minute] = time
      .slice(0, 5)
      .split(':')
      .map(Number);

    return hour * 60 + minute;
  }

  async create(
    adminUserId: string,
    dto: CreateActivityDto,
  ) {
    const activityDate = this.dateOnlyToUtc(
      dto.activityDate,
    );

    const activity = await this.prisma.activity.create({
      data: {
        title: dto.title,
        description: dto.description,
        activityDate,
        startTime: dto.startTime,
        endTime: dto.endTime,
        createdBy: adminUserId,
      },
    });

    await this.notificationService.notifyAllStaff(
      'Kegiatan Baru',
      `Kegiatan baru: ${activity.title}. Silakan buka menu Kegiatan untuk melihat detail.`,
      'ACTIVITY',
      activity.id,
    );

    return {
      success: true,
      message: 'Kegiatan berhasil dibuat',
      data: activity,
    };
  }

  async getActivities() {
    const activities =
      await this.prisma.activity.findMany({
        orderBy: [
          { activityDate: 'desc' },
          { startTime: 'desc' },
        ],
      });

    return {
      success: true,
      message: 'Daftar kegiatan berhasil diambil',
      data: activities,
    };
  }

  async getTodayActivities() {
    const today = this.getJakartaDate();

    const activities =
      await this.prisma.activity.findMany({
        where: {
          activityDate: this.dateOnlyToUtc(today),
        },
        orderBy: {
          startTime: 'asc',
        },
      });

    return {
      success: true,
      message: 'Kegiatan hari ini berhasil diambil',
      data: activities,
    };
  }

  async attend(
    userId: string,
    activityId: string,
    dto: AttendActivityDto,
  ) {
    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: { userId },
      });

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan belum tersedia untuk akun ini',
      );
    }

    const activity =
      await this.prisma.activity.findUnique({
        where: { id: activityId },
      });

    if (!activity) {
      throw new NotFoundException(
        'Kegiatan tidak ditemukan',
      );
    }

    const today = this.getJakartaDate();
    const activityDate =
      this.getDateOnlyFromUtc(activity.activityDate);

    if (activityDate !== today) {
      throw new BadRequestException(
        'Absensi kegiatan hanya dapat dilakukan pada tanggal kegiatan',
      );
    }

    const existing =
      await this.prisma.activityAttendance.findUnique({
        where: {
          activityId_employeeId: {
            activityId,
            employeeId: employee.id,
          },
        },
      });

    if (existing) {
      throw new BadRequestException(
        'Anda sudah melakukan absensi kegiatan ini',
      );
    }

    const nowMinutes = this.timeToMinutes(
      this.getJakartaNowTime(),
    );

    if (
      activity.startTime &&
      nowMinutes < this.timeToMinutes(activity.startTime)
    ) {
      throw new BadRequestException(
        'Absensi kegiatan belum dibuka',
      );
    }

    if (
      activity.endTime &&
      nowMinutes > this.timeToMinutes(activity.endTime)
    ) {
      throw new BadRequestException(
        'Waktu absen kegiatan sudah habis',
      );
    }

    const status =
      activity.startTime &&
      nowMinutes > this.timeToMinutes(activity.startTime)
        ? 'TERLAMBAT'
        : 'HADIR';

    const attendance =
      await this.prisma.activityAttendance.create({
        data: {
          activityId,
          employeeId: employee.id,
          attendedAt: new Date(),
          photo: dto.photo,
          latitude: dto.latitude,
          longitude: dto.longitude,
          status,
        },
      });

    return {
      success: true,
      message:
        status === 'TERLAMBAT'
          ? 'Absensi kegiatan berhasil, tetapi Anda terlambat'
          : 'Absensi kegiatan berhasil',
      data: attendance,
    };
  }

  async getMyAttendance(userId: string) {
    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: { userId },
      });

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan belum tersedia untuk akun ini',
      );
    }

    const records =
      await this.prisma.activityAttendance.findMany({
        where: {
          employeeId: employee.id,
        },
        include: {
          activity: true,
        },
        orderBy: {
          attendedAt: 'desc',
        },
      });

    return {
      success: true,
      message: 'Riwayat absensi kegiatan berhasil diambil',
      data: records,
    };
  }

  async getActivityDetail(activityId: string) {
    const activity =
      await this.prisma.activity.findUnique({
        where: { id: activityId },
      });

    if (!activity) {
      throw new NotFoundException(
        'Kegiatan tidak ditemukan',
      );
    }

    return {
      success: true,
      message: 'Detail kegiatan berhasil diambil',
      data: activity,
    };
  }

  async getActivityAttendance(activityId: string) {
    const activity =
      await this.prisma.activity.findUnique({
        where: { id: activityId },
      });

    if (!activity) {
      throw new NotFoundException(
        'Kegiatan tidak ditemukan',
      );
    }

    const records =
      await this.prisma.activityAttendance.findMany({
        where: { activityId },
        include: {
          employee: true,
        },
        orderBy: {
          attendedAt: 'asc',
        },
      });

    return {
      success: true,
      message:
        'Daftar peserta kegiatan berhasil diambil',
      data: records,
    };
  }
}
