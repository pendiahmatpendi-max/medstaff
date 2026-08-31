import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly prisma: PrismaService) {}

  // =========================================================
  // STAFF / ADMIN
  // GET PROFILE SENDIRI
  // =========================================================

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: any) {
    const userId = req.user.sub;

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
          birthPlace: true,
          birthDate: true,
          gender: true,
          identityNumber: true,
          address: true,
          companyName: true,
          position: true,
          profilePhoto: true,
          createdAt: true,
          updatedAt: true,

          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true,
              createdAt: true,
            },
          },

          emergencyContacts: {
            orderBy: {
              createdAt: 'asc',
            },
          },

          educations: {
            orderBy: [
              {
                endYear: 'desc',
              },
              {
                startYear: 'desc',
              },
            ],
          },

          experiences: {
            orderBy: {
              startDate: 'desc',
            },
          },
        },
      });

    if (!employee) {
      return {
        success: true,
        message: 'Profil karyawan belum tersedia',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Profil karyawan berhasil diambil',
      data: employee,
    };
  }

  // =========================================================
  // BUAT PROFILE SENDIRI
  // =========================================================

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async createMyProfile(
    @Req() req: any,
    @Body() body: any,
  ) {
    const userId = req.user.sub;

    const existing =
      await this.prisma.employeeProfile.findUnique({
        where: {
          userId,
        },
      });

    if (existing) {
      return {
        success: false,
        message: 'Profil karyawan sudah tersedia',
        data: existing,
      };
    }

    const employee =
      await this.prisma.employeeProfile.create({
        data: {
          userId,
          employeeId: body.employeeId,
          fullName: body.fullName,
          phone: body.phone,
          birthPlace: body.birthPlace,
          birthDate: new Date(body.birthDate),
          gender: body.gender,
          identityNumber: body.identityNumber || null,
          address: body.address || null,
          companyName:
            body.companyName ||
            'Klinik Pratama Unimus',
          position: body.position,
          profilePhoto:
            body.profilePhoto || null,
        },
      });

    return {
      success: true,
      message: 'Profil karyawan berhasil dibuat',
      data: employee,
    };
  }

  // =========================================================
  // UPDATE PROFILE SENDIRI
  // =========================================================

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(
    @Req() req: any,
    @Body() body: any,
  ) {
    const userId = req.user.sub;

    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          userId,
        },
      });

    if (!employee) {
      return {
        success: true,
        message: 'Profil karyawan belum tersedia',
        data: null,
      };
    }

    const allowedFields = [
      'fullName',
      'phone',
      'birthPlace',
      'birthDate',
      'gender',
      'identityNumber',
      'address',
      'profilePhoto',
    ];

    const updateData: Record<string, any> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (updateData.birthDate) {
      updateData.birthDate = new Date(
        updateData.birthDate,
      );
    }

    const updated =
      await this.prisma.employeeProfile.update({
        where: {
          id: employee.id,
        },
        data: updateData,
        select: {
          id: true,
          employeeId: true,
          fullName: true,
          phone: true,
          birthPlace: true,
          birthDate: true,
          gender: true,
          identityNumber: true,
          address: true,
          companyName: true,
          position: true,
          profilePhoto: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return {
      success: true,
      message: 'Profil karyawan berhasil diperbarui',
      data: updated,
    };
  }

  // =========================================================
  // ADMIN - SEMUA KARYAWAN
  // =========================================================

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  async getEmployees() {
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

          user: {
            select: {
              email: true,
              role: true,
              isActive: true,
            },
          },
        },
      });

    return {
      success: true,
      message: 'Daftar karyawan berhasil diambil',
      data: employees,
    };
  }

  // =========================================================
  // DETAIL KARYAWAN
  // =========================================================

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getEmployeeById(
    @Param('id') id: string,
  ) {
    const employee =
      await this.prisma.employeeProfile.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          employeeId: true,
          fullName: true,
          phone: true,
          birthPlace: true,
          birthDate: true,
          gender: true,
          identityNumber: true,
          address: true,
          companyName: true,
          position: true,
          profilePhoto: true,

          emergencyContacts: {
            orderBy: {
              createdAt: 'asc',
            },
          },

          educations: {
            orderBy: [
              {
                endYear: 'desc',
              },
              {
                startYear: 'desc',
              },
            ],
          },

          experiences: {
            orderBy: {
              startDate: 'desc',
            },
          },
        },
      });

    if (!employee) {
      return {
        success: false,
        message: 'Karyawan tidak ditemukan',
        data: null,
      };
    }

    return {
      success: true,
      message: 'Data karyawan berhasil diambil',
      data: employee,
    };
  }
}