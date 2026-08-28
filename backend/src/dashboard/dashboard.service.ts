import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Mendapatkan tanggal hari ini berdasarkan WIB.
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
   */
  private dateOnlyToUtc(dateString: string): Date {
    const [year, month, day] =
      dateString.split('-').map(Number);

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
   * DASHBOARD STAFF
   *
   * Menampilkan:
   * - data karyawan
   * - jadwal hari ini
   * - status absensi hari ini
   * - kegiatan hari ini
   */
  async getStaffDashboard(userId: string) {
    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          userId,
        },
        select: {
          id: true,
          employeeId: true,
          fullName: true,
          phone: true,
          position: true,
          companyName: true,
          profilePhoto: true,
        },
      });

    if (!employee) {
      throw new NotFoundException(
        'Profil karyawan belum tersedia untuk akun ini',
      );
    }

    const todayString =
      this.getJakartaDate();

    const today =
      this.dateOnlyToUtc(todayString);

    const schedule =
      await this.prisma.workSchedule.findUnique({
        where: {
          employeeId_scheduleDate: {
            employeeId: employee.id,
            scheduleDate: today,
          },
        },
        include: {
          shift: true,
        },
      });

    const attendance =
      await this.prisma.attendance.findUnique({
        where: {
          employeeId_attendanceDate: {
            employeeId: employee.id,
            attendanceDate: today,
          },
        },
      });

    const activities =
      await this.prisma.activity.findMany({
        where: {
          activityDate: today,
          isActive: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      });

    let attendanceStatus:
      | 'BELUM_ABSEN'
      | 'HADIR'
      | 'TERLAMBAT'
      | 'IZIN'
      | 'LIBUR' = 'BELUM_ABSEN';

    if (schedule?.dayType === 'LIBUR') {
      attendanceStatus = 'LIBUR';
    } else if (attendance) {
      attendanceStatus = attendance.status;
    } else if (schedule?.shift) {
      const now = new Date();

      const [hours, minutes] =
        schedule.shift.startTime
          .split(':')
          .map(Number);

      const shiftStart =
        new Date(
          Date.UTC(
            Number(todayString.substring(0, 4)),
            Number(todayString.substring(5, 7)) - 1,
            Number(todayString.substring(8, 10)),
            hours - 7,
            minutes,
            0,
            0,
          ),
        );

      attendanceStatus =
        now <= shiftStart
          ? 'BELUM_ABSEN'
          : 'TERLAMBAT';
    }

    return {
      success: true,
      message: 'Dashboard staff berhasil diambil',
      data: {
        date: todayString,

        employee,

        schedule: schedule
          ? {
              id: schedule.id,
              scheduleDate:
                schedule.scheduleDate,
              dayType: schedule.dayType,
              note: schedule.note,
              shift: schedule.shift
                ? {
                    id: schedule.shift.id,
                    name: schedule.shift.name,
                    category:
                      schedule.shift.category,
                    startTime:
                      schedule.shift.startTime,
                    endTime:
                      schedule.shift.endTime,
                    crossesMidnight:
                      schedule.shift.crossesMidnight,
                  }
                : null,
            }
          : null,

        attendance: attendance
          ? {
              id: attendance.id,
              attendanceDate:
                attendance.attendanceDate,
              clockIn: attendance.clockIn,
              clockOut: attendance.clockOut,
              clockInPhoto:
                attendance.clockInPhoto,
              clockOutPhoto:
                attendance.clockOutPhoto,
              clockInLatitude:
                attendance.clockInLatitude,
              clockInLongitude:
                attendance.clockInLongitude,
              clockOutLatitude:
                attendance.clockOutLatitude,
              clockOutLongitude:
                attendance.clockOutLongitude,
              status: attendance.status,
            }
          : null,

        attendanceStatus,

        activities: activities.map(
          (activity) => ({
            id: activity.id,
            title: activity.title,
            description:
              activity.description,
            activityDate:
              activity.activityDate,
            startTime:
              activity.startTime,
            endTime:
              activity.endTime,
            isActive:
              activity.isActive,
          }),
        ),
      },
    };
  }

  /**
   * DASHBOARD ADMIN
   *
   * Menampilkan ringkasan kondisi klinik hari ini.
   */
  async getAdminDashboard() {
    const todayString =
      this.getJakartaDate();

    const today =
      this.dateOnlyToUtc(todayString);

    const [
      totalEmployees,
      attendanceRecords,
      todayActivities,
      activeSchedules,
    ] = await Promise.all([
      this.prisma.employeeProfile.count(),

      this.prisma.attendance.findMany({
        where: {
          attendanceDate: today,
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
        orderBy: {
          clockIn: 'asc',
        },
      }),

      this.prisma.activity.findMany({
        where: {
          activityDate: today,
          isActive: true,
        },
        orderBy: {
          startTime: 'asc',
        },
      }),

      this.prisma.workSchedule.findMany({
        where: {
          scheduleDate: today,
          dayType: 'KERJA',
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
          shift: true,
        },
        orderBy: {
          employee: {
            fullName: 'asc',
          },
        },
      }),
    ]);

    const hadir =
      attendanceRecords.filter(
        (item) =>
          item.status === 'HADIR',
      ).length;

    const terlambat =
      attendanceRecords.filter(
        (item) =>
          item.status === 'TERLAMBAT',
      ).length;

    const izin =
      attendanceRecords.filter(
        (item) =>
          item.status === 'IZIN',
      ).length;

    const sudahClockOut =
      attendanceRecords.filter(
        (item) =>
          item.clockOut !== null,
      ).length;

    const belumAbsen =
      Math.max(
        totalEmployees -
          attendanceRecords.length,
        0,
      );

    return {
      success: true,
      message: 'Dashboard admin berhasil diambil',
      data: {
        date: todayString,

        summary: {
          totalEmployees,
          totalSchedules:
            activeSchedules.length,
          totalAttendance:
            attendanceRecords.length,
          hadir,
          terlambat,
          izin,
          belumAbsen,
          sudahClockOut,
        },

        attendance:
          attendanceRecords.map(
            (item) => ({
              id: item.id,
              employeeId:
                item.employeeId,
              attendanceDate:
                item.attendanceDate,
              clockIn:
                item.clockIn,
              clockOut:
                item.clockOut,
              status:
                item.status,
              clockInLatitude:
                item.clockInLatitude,
              clockInLongitude:
                item.clockInLongitude,
              clockOutLatitude:
                item.clockOutLatitude,
              clockOutLongitude:
                item.clockOutLongitude,

              employee:
                item.employee,
            }),
          ),

        schedules:
          activeSchedules.map(
            (schedule) => ({
              id: schedule.id,
              scheduleDate:
                schedule.scheduleDate,
              dayType:
                schedule.dayType,
              note:
                schedule.note,

              employee:
                schedule.employee,

              shift:
                schedule.shift
                  ? {
                      id:
                        schedule.shift.id,
                      name:
                        schedule.shift.name,
                      category:
                        schedule.shift.category,
                      startTime:
                        schedule.shift.startTime,
                      endTime:
                        schedule.shift.endTime,
                      crossesMidnight:
                        schedule.shift
                          .crossesMidnight,
                    }
                  : null,
            }),
          ),

        activities:
          todayActivities.map(
            (activity) => ({
              id: activity.id,
              title: activity.title,
              description:
                activity.description,
              activityDate:
                activity.activityDate,
              startTime:
                activity.startTime,
              endTime:
                activity.endTime,
              isActive:
                activity.isActive,
            }),
          ),
      },
    };
  }
}