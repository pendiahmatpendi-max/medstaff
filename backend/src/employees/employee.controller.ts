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

    const employee = await this.prisma.employeeProfile.create({
      data: {
        userId,
        employeeId: body.employeeId,
        fullName: body.fullName,
        phone: body.phone,
        birthPlace: body.birthPlace,
        birthDate: new Date(body.birthDate),
        gender: body.gender,
        identityNumber: body.identityNumber,
        address: body.address,
        companyName:
          body.companyName || 'Klinik Pratama Unimus',
        position: body.position,
        profilePhoto: body.profilePhoto || null,
      },
    });

    return {
      success: true,
      message: 'Profil karyawan berhasil dibuat',
      data: employee,
    };
  }