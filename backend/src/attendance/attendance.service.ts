import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // TIMEZONE WIB
  // =========================================================

  /**
   * Mengambil tanggal hari ini berdasarkan WIB.
   *
   * Contoh:
   * Jika server berada di Amerika dan waktu server masih
   * 27 Agustus, tetapi WIB sudah 28 Agustus,
   * fungsi ini tetap menghasilkan 28 Agustus.
   */
  private getJakartaDateString(): string {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }

  /**
   * Mengubah YYYY-MM-DD menjadi representasi tanggal
   * PostgreSQL @db.Date pada awal hari WIB.
   *
   * 00:00 WIB = 07:00 UTC
   */
  private dateStringToUtc(dateString: string): Date {
    const [year, month, day] = dateString
      .split('-')
      .map(Number);

    return new Date(
      Date.UTC(
        year,
        month - 1,
        day,
        7,
        0,
        0,
        0,
      ),
    );
  }

  /**
   * Tanggal hari ini dalam bentuk Date.
   */
  private getToday(): Date {
    return this.dateStringToUtc(
      this.getJakartaDateString(),
    );
  }

  /**
   * Tanggal kemarin berdasarkan WIB.
   */
  private getYesterday(): Date {
    const todayString =
      this.getJakartaDateString();

    const [year, month, day] = todayString
      .split('-')
      .map(Number);

    return new Date(
      Date.UTC(
        year,
        month - 1,
        day - 1,
        7,
        0,
        0,
        0,
      ),
    );
  }

  /**
   * Waktu server sebenarnya.
   * Date disimpan dalam UTC oleh JavaScript/PostgreSQL,
   * kemudian frontend dapat menampilkannya sebagai WIB.
   */
  private getCurrentTime(): Date {
    return new Date();
  }

  // =========================================================
  // EMPLOYEE
  // =========================================================

  private async getEmployeeProfile(
    userId: string,
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

    return employee;
  }

  // =========================================================
  // SHIFT TIME
  // =========================================================

  /**
   * Membuat waktu shift berdasarkan tanggal WIB.
   *
   * Contoh:
   *
   * 2026-08-28 + 08:00 WIB
   *
   * menjadi:
   *
   * 2026-08-28T01:00:00.000Z
   */
  private createJakartaTime(
    dateString: string,
    timeString: string,
  ): Date {
    const [year, month, day] = dateString
      .split('-')
      .map(Number);

    const [hours, minutes] = timeString
      .split(':')
      .map(Number);

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
   * Menentukan status kehadiran berdasarkan jam mulai shift.
   */
  private getAttendanceStatus(
    now: Date,
    shiftStart: Date,
  ): 'HADIR' | 'TERLAMBAT' {
    if (now <= shiftStart) {
      return 'HADIR';
    }

    return 'TERLAMBAT';
  }

  // =========================================================
  // SHIFT RESPONSE
  // =========================================================

  private getShiftInfo(shift: any) {
    if (!shift) {
      return null;
    }

    return {
      id: shift.id,
      name: shift.name,
      category: shift.category,
      startTime: shift.startTime,
      endTime: shift.endTime,
      crossesMidnight:
        shift.crossesMidnight,
    };
  }

  // =========================================================
  // CLOCK IN
  // =========================================================

  async clockIn(
    userId: string,
    dto: ClockInDto,
  ) {
    const employee =
      await this.getEmployeeProfile(userId);

    const todayString =
      this.getJakartaDateString();

    const attendanceDate =
      this.dateStringToUtc(
        todayString,
      );

    const now =
      this.getCurrentTime();

    // -------------------------------------------------------
    // Ambil jadwal hari ini
    // -------------------------------------------------------

    const schedule =
      await this.prisma.workSchedule.findUnique({
        where: {
          employeeId_scheduleDate: {
            employeeId: employee.id,
            scheduleDate:
              attendanceDate,
          },
        },
        include: {
          shift: true,
        },
      });

    if (!schedule) {
      throw new BadRequestException(
        'Jadwal kerja hari ini belum tersedia',
      );
    }

    // -------------------------------------------------------
    // Cek hari libur
    // -------------------------------------------------------

    if (
      schedule.dayType ===
      'LIBUR'
    ) {
      throw new BadRequestException(
        'Hari ini adalah hari libur. Anda tidak dapat melakukan Clock In.',
      );
    }

    // -------------------------------------------------------
    // Cek shift
    // -------------------------------------------------------

    if (!schedule.shift) {
      throw new BadRequestException(
        'Shift kerja hari ini belum ditentukan',
      );
    }

    // -------------------------------------------------------
    // Tentukan status HADIR / TERLAMBAT
    // -------------------------------------------------------

    const shiftStart =
      this.createJakartaTime(
        todayString,
        schedule.shift.startTime,
      );

    const status =
      this.getAttendanceStatus(
        now,
        shiftStart,
      );

    // -------------------------------------------------------
    // Cek apakah sudah Clock In
    // -------------------------------------------------------

    const existing =
      await this.prisma.attendance.findUnique({
        where: {
          employeeId_attendanceDate: {
            employeeId:
              employee.id,
            attendanceDate,
          },
        },
      });

    if (existing?.clockIn) {
      throw new BadRequestException(
        'Anda sudah melakukan Clock In hari ini',
      );
    }

    // -------------------------------------------------------
    // Simpan Clock In
    // -------------------------------------------------------

    const attendance = existing
      ? await this.prisma.attendance.update({
          where: {
            id: existing.id,
          },
          data: {
            clockIn: now,
            clockInPhoto:
              dto.photo,
            clockInLatitude:
              dto.latitude,
            clockInLongitude:
              dto.longitude,
            status,
          },
        })
      : await this.prisma.attendance.create({
          data: {
            employeeId:
              employee.id,
            attendanceDate,
            clockIn: now,
            clockInPhoto:
              dto.photo,
            clockInLatitude:
              dto.latitude,
            clockInLongitude:
              dto.longitude,
            status,
          },
        });

    // -------------------------------------------------------
    // Response
    // -------------------------------------------------------

    return {
      success: true,
      message:
        status === 'TERLAMBAT'
          ? 'Clock In berhasil, tetapi Anda terlambat'
          : 'Clock In berhasil',
      data: {
        ...attendance,

        shift:
          this.getShiftInfo(
            schedule.shift,
          ),

        attendanceStatus:
          status,

        serverTime:
          now,
      },
    };
  }

  // =========================================================
  // CLOCK OUT
  // =========================================================

  async clockOut(
    userId: string,
    dto: ClockOutDto,
  ) {
    const employee =
      await this.getEmployeeProfile(userId);

    const todayString =
      this.getJakartaDateString();

    const today =
      this.dateStringToUtc(
        todayString,
      );

    const now =
      this.getCurrentTime();

    // -------------------------------------------------------
    // Cari attendance hari ini
    // -------------------------------------------------------

    let attendance =
      await this.prisma.attendance.findUnique({
        where: {
          employeeId_attendanceDate: {
            employeeId:
              employee.id,
            attendanceDate:
              today,
          },
        },
      });

    let scheduleDate =
      today;

    let scheduleDateString =
      todayString;

    // -------------------------------------------------------
    // Cek shift malam dari hari sebelumnya
    // -------------------------------------------------------

    if (!attendance) {
      const yesterday =
        this.getYesterday();

      const yesterdayString =
        yesterday
          .toISOString()
          .slice(0, 10);

      const yesterdaySchedule =
        await this.prisma.workSchedule.findUnique({
          where: {
            employeeId_scheduleDate: {
              employeeId:
                employee.id,
              scheduleDate:
                yesterday,
            },
          },
          include: {
            shift: true,
          },
        });

      if (
        yesterdaySchedule
          ?.shift
          ?.crossesMidnight
      ) {
        attendance =
          await this.prisma.attendance.findUnique({
            where: {
              employeeId_attendanceDate: {
                employeeId:
                  employee.id,
                attendanceDate:
                  yesterday,
              },
            },
          });

        if (attendance) {
          scheduleDate =
            yesterday;

          scheduleDateString =
            yesterdayString;
        }
      }
    }

    // -------------------------------------------------------
    // Ambil jadwal
    // -------------------------------------------------------

    const schedule =
      await this.prisma.workSchedule.findUnique({
        where: {
          employeeId_scheduleDate: {
            employeeId:
              employee.id,
            scheduleDate,
          },
        },
        include: {
          shift: true,
        },
      });

    if (!schedule) {
      throw new BadRequestException(
        'Jadwal kerja belum tersedia',
      );
    }

    // -------------------------------------------------------
    // Cek hari libur
    // -------------------------------------------------------

    if (
      schedule.dayType ===
      'LIBUR'
    ) {
      throw new BadRequestException(
        'Hari ini adalah hari libur',
      );
    }

    // -------------------------------------------------------
    // Cek Clock In
    // -------------------------------------------------------

    if (
      !attendance ||
      !attendance.clockIn
    ) {
      throw new BadRequestException(
        'Anda belum melakukan Clock In',
      );
    }

    // -------------------------------------------------------
    // Cek Clock Out
    // -------------------------------------------------------

    if (
      attendance.clockOut
    ) {
      throw new BadRequestException(
        'Anda sudah melakukan Clock Out',
      );
    }

    // -------------------------------------------------------
    // Validasi jam mulai shift
    // -------------------------------------------------------

    if (schedule.shift) {
      const shiftStart =
        this.createJakartaTime(
          scheduleDateString,
          schedule.shift.startTime,
        );

      if (now < shiftStart) {
        throw new BadRequestException(
          'Clock Out belum dapat dilakukan sebelum jam kerja dimulai',
        );
      }
    }

    // -------------------------------------------------------
    // Simpan Clock Out
    // -------------------------------------------------------

    const updated =
      await this.prisma.attendance.update({
        where: {
          id: attendance.id,
        },
        data: {
          clockOut: now,
          clockOutPhoto:
            dto.photo,
          clockOutLatitude:
            dto.latitude,
          clockOutLongitude:
            dto.longitude,
        },
      });

    // -------------------------------------------------------
    // Response
    // -------------------------------------------------------

    return {
      success: true,
      message:
        'Clock Out berhasil',
      data: {
        ...updated,

        shift:
          this.getShiftInfo(
            schedule.shift,
          ),

        serverTime:
          now,
      },
    };
  }

  // =========================================================
  // TODAY ATTENDANCE
  // =========================================================

  async getTodayAttendance(
    userId: string,
  ) {
    const employee =
      await this.getEmployeeProfile(userId);

    const todayString =
      this.getJakartaDateString();

    const today =
      this.dateStringToUtc(
        todayString,
      );

    const now =
      this.getCurrentTime();

    // -------------------------------------------------------
    // Ambil jadwal hari ini
    // -------------------------------------------------------

    const schedule =
      await this.prisma.workSchedule.findUnique({
        where: {
          employeeId_scheduleDate: {
            employeeId:
              employee.id,
            scheduleDate:
              today,
          },
        },
        include: {
          shift: true,
        },
      });

    // -------------------------------------------------------
    // Ambil attendance hari ini
    // -------------------------------------------------------

    const attendance =
      await this.prisma.attendance.findUnique({
        where: {
          employeeId_attendanceDate: {
            employeeId:
              employee.id,
            attendanceDate:
              today,
          },
        },
      });

    // -------------------------------------------------------
    // Tentukan status
    // -------------------------------------------------------

    let attendanceStatus:
      | 'BELUM_ABSEN'
      | 'HADIR'
      | 'TERLAMBAT'
      | 'IZIN'
      | 'LIBUR' =
      'BELUM_ABSEN';

    if (
      schedule?.dayType ===
      'LIBUR'
    ) {
      attendanceStatus =
        'LIBUR';
    } else if (
      attendance
    ) {
      attendanceStatus =
        attendance.status;
    } else if (
      schedule?.shift
    ) {
      const shiftStart =
        this.createJakartaTime(
          todayString,
          schedule.shift.startTime,
        );

      attendanceStatus =
        this.getAttendanceStatus(
          now,
          shiftStart,
        );
    }

    // -------------------------------------------------------
    // Response
    // -------------------------------------------------------

    return {
      success: true,
      message:
        'Status absensi hari ini berhasil diambil',

      data: {
        date:
          today,

        dateString:
          todayString,

        serverTime:
          now,

        employee: {
          id:
            employee.id,

          employeeId:
            employee.employeeId,

          fullName:
            employee.fullName,

          position:
            employee.position,
        },

        schedule:
          schedule
            ? {
                id:
                  schedule.id,

                scheduleDate:
                  schedule.scheduleDate,

                dayType:
                  schedule.dayType,

                note:
                  schedule.note,

                shift:
                  this.getShiftInfo(
                    schedule.shift,
                  ),
              }
            : null,

        attendance,

        attendanceStatus,
      },
    };
  }

  // =========================================================
  // HISTORY
  // =========================================================

  async getHistory(
    userId: string,
  ) {
    const employee =
      await this.getEmployeeProfile(userId);

    const records =
      await this.prisma.attendance.findMany({
        where: {
          employeeId:
            employee.id,
        },
        orderBy: {
          attendanceDate:
            'desc',
        },
      });

    return {
      success: true,
      message:
        'Riwayat absensi berhasil diambil',
      data: records,
    };
  }
}