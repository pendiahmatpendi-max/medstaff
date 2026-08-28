import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { AttendActivityDto } from './dto/attend-activity.dto';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mendapatkan tanggal hari ini berdasarkan timezone Indonesia (WIB).
   * Format: YYYY-MM-DD
   */
  private getJakartaDate(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }

  /**
   * Mengubah tanggal YYYY-MM-DD menjadi Date UTC midnight.
   *
   * Field database menggunakan @db.Date,
   * sehingga tanggal kalender disimpan sebagai UTC midnight.
   */
  private dateOnlyToUtc(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);

    return new Date(
      Date.UTC(year, month - 1, day, 0, 0, 0, 0),
    );
  }

  /**
   * Mengambil YYYY-MM-DD dari Date database.
   */
  private getDateOnlyFromUtc(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  /**
   * Membuat Date UTC berdasarkan tanggal + jam WIB.
   *
   * WIB = UTC+7.
   */
  private createJakartaTime(
    dateString: string,
    timeString: string,
  ): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    const [hours, minutes] = timeString.split(':').map(Number);

    return new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        hours - 7,
        minutes,
        0,
        0,
      ),
    );
  }

  /**
   * Membuat kegiatan baru.
   */
  async create(
    userId: string,
    dto: CreateActivityDto,
  ) {
    if (dto.startTime && dto.endTime) {
      const startTime = this.createJakartaTime(
        dto.activityDate,
        dto.startTime,
      );

      const endTime = this.createJakartaTime(
        dto.activityDate,
        dto.endTime,
      );

      if (endTime <= startTime) {
        throw new BadRequestException(
          'endTime harus lebih besar dari startTime',
        );
      }
    }

    const activity = await this.prisma.activity.create({
      data: {
        title: dto.title.trim(),
        description: dto.description?.trim(),
        activityDate: this.dateOnlyToUtc(dto.activityDate),
        startTime: dto.startTime,
        endTime: dto.endTime,
        createdBy: userId,
      },
    });

    return {
      success: true,
      message: 'Kegiatan berhasil dibuat',
      data: activity,
    };
  }

  /**
   * Mengambil seluruh kegiatan aktif.
   */
  async getActivities() {
    const activities =
      await this.prisma.activity.findMany({
        where: {
          isActive: true,
        },
        orderBy: [
          {
            activityDate: 'desc',
          },
          {
            startTime: 'asc',
          },
        ],
      });

    return {
      success: true,
      message: 'Daftar kegiatan berhasil diambil',
      data: activities,
    };
  }

  /**
   * Mengambil kegiatan aktif hari ini berdasarkan WIB.
   */
  async getTodayActivities() {
    const today = this.getJakartaDate();

    const startOfToday = this.dateOnlyToUtc(today);

    const tomorrow = new Date(startOfToday);
    tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

    const activities =
      await this.prisma.activity.findMany({
        where: {
          isActive: true,
          activityDate: {
            gte: startOfToday,
            lt: tomorrow,
          },
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

  /**
   * Absen kegiatan oleh STAFF.
   */
  async attend(
    userId: string,
    activityId: string,
    dto: AttendActivityDto,
  ) {
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

    const activity =
      await this.prisma.activity.findUnique({
        where: {
          id: activityId,
        },
      });

    if (!activity || !activity.isActive) {
      throw new NotFoundException(
        'Kegiatan tidak ditemukan',
      );
    }

    const today = this.getJakartaDate();

    const activityDate =
      this.getDateOnlyFromUtc(
        activity.activityDate,
      );

    if (today !== activityDate) {
      throw new BadRequestException(
        'Kegiatan hanya dapat diabsen pada tanggal kegiatan',
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
        'Anda sudah melakukan absen kegiatan ini',
      );
    }

    const now = new Date();

    let status = 'HADIR';

    if (activity.startTime) {
      const startTime = this.createJakartaTime(
        activityDate,
        activity.startTime,
      );

      if (now > startTime) {
        status = 'TERLAMBAT';
      }
    }

    /**
     * Jika endTime tersedia, absen setelah kegiatan
     * selesai tidak diperbolehkan.
     */
    if (activity.endTime) {
      const endTime = this.createJakartaTime(
        activityDate,
        activity.endTime,
      );

      if (now > endTime) {
        throw new BadRequestException(
          'Waktu absen kegiatan sudah berakhir',
        );
      }
    }

    const attendance =
      await this.prisma.activityAttendance.create({
        data: {
          activityId,
          employeeId: employee.id,
          attendedAt: now,
          photo: dto.photo,
          latitude: dto.latitude,
          longitude: dto.longitude,
          status,
        },
        include: {
          activity: true,
        },
      });

    return {
      success: true,
      message:
        status === 'TERLAMBAT'
          ? 'Absen kegiatan berhasil, tetapi Anda terlambat'
          : 'Absen kegiatan berhasil',
      data: attendance,
    };
  }

  /**
   * Mengambil riwayat absen kegiatan milik STAFF.
   */
  async getMyAttendance(userId: string) {
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
      message: 'Riwayat absen kegiatan berhasil diambil',
      data: records,
    };
  }
}