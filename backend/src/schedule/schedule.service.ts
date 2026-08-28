import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // TIMEZONE WIB
  // =========================================================

  /**
   * Mengambil tanggal hari ini berdasarkan timezone WIB.
   * Hasil: YYYY-MM-DD
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
   * Mengubah YYYY-MM-DD menjadi UTC midnight.
   *
   * WorkSchedule menggunakan @db.Date sehingga
   * tanggal kalender disimpan secara konsisten.
   */
  private dateOnlyToUtc(dateString: string): Date {
    const [year, month, day] = dateString
      .split('-')
      .map(Number);

    return new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        0,
        0,
        0,
        0,
      ),
    );
  }

  /**
   * Mengubah Date database menjadi YYYY-MM-DD.
   */
  private getDateOnlyFromUtc(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  // =========================================================
  // ADMIN - BUAT / UPDATE JADWAL
  // =========================================================

  async create(dto: CreateScheduleDto) {
    // -------------------------------------------------------
    // 1. Pastikan employee tersedia
    // -------------------------------------------------------

    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          id: dto.employeeId,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Karyawan tidak ditemukan',
      );
    }

    // -------------------------------------------------------
    // 2. Tentukan tipe hari
    // -------------------------------------------------------

    const dayType = dto.dayType || 'KERJA';

    // -------------------------------------------------------
    // 3. Validasi shift
    // -------------------------------------------------------

    if (
      dayType === 'KERJA' &&
      !dto.shiftId
    ) {
      throw new BadRequestException(
        'Shift wajib dipilih untuk hari kerja',
      );
    }

    if (
      dayType === 'LIBUR' &&
      dto.shiftId
    ) {
      throw new BadRequestException(
        'Hari libur tidak boleh memiliki shift',
      );
    }

    // -------------------------------------------------------
    // 4. Pastikan shift tersedia
    // -------------------------------------------------------

    if (dto.shiftId) {
      const shift =
        await this.prisma.shift.findUnique({
          where: {
            id: dto.shiftId,
          },
        });

      if (!shift || !shift.isActive) {
        throw new NotFoundException(
          'Shift tidak ditemukan atau tidak aktif',
        );
      }
    }

    // -------------------------------------------------------
    // 5. Normalisasi tanggal
    // -------------------------------------------------------

    const scheduleDate =
      this.dateOnlyToUtc(
        dto.scheduleDate.slice(0, 10),
      );

    // -------------------------------------------------------
    // 6. Simpan jadwal
    //
    // Jika jadwal tanggal tersebut sudah ada,
    // maka update jadwal lama.
    // -------------------------------------------------------

    const schedule =
      await this.prisma.workSchedule.upsert({
        where: {
          employeeId_scheduleDate: {
            employeeId: dto.employeeId,
            scheduleDate,
          },
        },

        update: {
          shiftId: dto.shiftId || null,
          dayType,
          note: dto.note,
        },

        create: {
          employeeId: dto.employeeId,
          scheduleDate,
          shiftId: dto.shiftId || null,
          dayType,
          note: dto.note,
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

          shift: true,
        },
      });

    return {
      success: true,
      message: 'Jadwal berhasil disimpan',
      data: schedule,
    };
  }

  // =========================================================
  // ADMIN - DAFTAR KARYAWAN
  // =========================================================

  async getEmployeesForAdmin() {
    const employees =
      await this.prisma.employeeProfile.findMany({
        orderBy: {
          fullName: 'asc',
        },

        select: {
          id: true,
          employeeId: true,
          fullName: true,
          position: true,
          companyName: true,
          profilePhoto: true,
        },
      });

    return {
      success: true,
      message: 'Daftar karyawan berhasil diambil',
      data: employees,
    };
  }

  // =========================================================
  // STAFF - JADWAL BULANAN
  // =========================================================

  async getEmployeeSchedule(
    userId: string,
    year: number,
    month: number,
  ) {
    // -------------------------------------------------------
    // Cari EmployeeProfile berdasarkan USER ID
    // -------------------------------------------------------

    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          userId,
        },

        select: {
          id: true,
          employeeId: true,
          fullName: true,
          position: true,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan belum tersedia',
      );
    }

    // -------------------------------------------------------
    // Validasi bulan
    // -------------------------------------------------------

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      throw new BadRequestException(
        'Parameter year dan month tidak valid',
      );
    }

    // -------------------------------------------------------
    // Tentukan range bulan menggunakan UTC
    // -------------------------------------------------------

    const startDate = new Date(
      Date.UTC(
        year,
        month - 1,
        1,
      ),
    );

    const endDate = new Date(
      Date.UTC(
        year,
        month,
        1,
      ),
    );

    // -------------------------------------------------------
    // Ambil jadwal berdasarkan EmployeeProfile ID
    // -------------------------------------------------------

    const schedules =
      await this.prisma.workSchedule.findMany({
        where: {
          employeeId: employee.id,

          scheduleDate: {
            gte: startDate,
            lt: endDate,
          },
        },

        orderBy: {
          scheduleDate: 'asc',
        },

        include: {
          shift: true,
        },
      });

    return {
      success: true,
      message: 'Jadwal berhasil diambil',

      data: {
        employee: {
          id: employee.id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          position: employee.position,
        },

        schedules,
      },
    };
  }

  // =========================================================
  // STAFF - JADWAL HARI INI
  // =========================================================

  async getTodaySchedule(userId: string) {
    // -------------------------------------------------------
    // PENTING:
    //
    // req.user.sub = ID USER
    //
    // WorkSchedule.employeeId = ID EMPLOYEE PROFILE
    //
    // Jadi kita harus mencari EmployeeProfile terlebih dahulu.
    // -------------------------------------------------------

    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          userId,
        },

        select: {
          id: true,
          employeeId: true,
          fullName: true,
          position: true,
          companyName: true,
          profilePhoto: true,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan belum tersedia',
      );
    }

    // -------------------------------------------------------
    // Ambil tanggal WIB
    // -------------------------------------------------------

    const today =
      this.getJakartaDate();

    // -------------------------------------------------------
    // Ubah menjadi UTC midnight
    // -------------------------------------------------------

    const scheduleDate =
      this.dateOnlyToUtc(today);

    // -------------------------------------------------------
    // Cari jadwal menggunakan EMPLOYEE PROFILE ID
    // -------------------------------------------------------

    const schedule =
      await this.prisma.workSchedule.findUnique({
        where: {
          employeeId_scheduleDate: {
            employeeId: employee.id,
            scheduleDate,
          },
        },

        include: {
          shift: true,
        },
      });

    // -------------------------------------------------------
    // Jika belum ada jadwal
    // -------------------------------------------------------

    if (!schedule) {
      return {
        success: true,
        message:
          'Jadwal hari ini belum tersedia',
        data: null,
      };
    }

    // -------------------------------------------------------
    // Jika jadwal ditemukan
    // -------------------------------------------------------

    return {
      success: true,
      message:
        'Jadwal hari ini berhasil diambil',

      data: {
        id: schedule.id,
        employeeId: schedule.employeeId,
        shiftId: schedule.shiftId,
        scheduleDate:
          schedule.scheduleDate,
        dayType: schedule.dayType,
        note: schedule.note,
        createdAt: schedule.createdAt,
        updatedAt: schedule.updatedAt,

        employee: {
          id: employee.id,
          employeeId: employee.employeeId,
          fullName: employee.fullName,
          position: employee.position,
          companyName: employee.companyName,
          profilePhoto: employee.profilePhoto,
        },

        shift: schedule.shift,
      },
    };
  }

  // =========================================================
  // ADMIN - JADWAL BULANAN KARYAWAN
  // =========================================================

  async getEmployeeScheduleById(
    employeeId: string,
    year: number,
    month: number,
  ) {
    // -------------------------------------------------------
    // Validasi employee
    // -------------------------------------------------------

    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          id: employeeId,
        },

        select: {
          id: true,
          employeeId: true,
          fullName: true,
          position: true,
          companyName: true,
          profilePhoto: true,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Karyawan tidak ditemukan',
      );
    }

    // -------------------------------------------------------
    // Validasi bulan
    // -------------------------------------------------------

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      month < 1 ||
      month > 12
    ) {
      throw new BadRequestException(
        'Parameter year dan month tidak valid',
      );
    }

    // -------------------------------------------------------
    // Range tanggal
    // -------------------------------------------------------

    const startDate = new Date(
      Date.UTC(
        year,
        month - 1,
        1,
      ),
    );

    const endDate = new Date(
      Date.UTC(
        year,
        month,
        1,
      ),
    );

    // -------------------------------------------------------
    // Ambil jadwal
    // -------------------------------------------------------

    const schedules =
      await this.prisma.workSchedule.findMany({
        where: {
          employeeId,

          scheduleDate: {
            gte: startDate,
            lt: endDate,
          },
        },

        orderBy: {
          scheduleDate: 'asc',
        },

        include: {
          shift: true,
        },
      });

    return {
      success: true,
      message:
        'Jadwal karyawan berhasil diambil',

      data: {
        employee,
        schedules,
      },
    };
  }
}