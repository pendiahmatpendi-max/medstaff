import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Controller()
export class AppController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getHealth() {
    return {
      success: true,
      message: 'MedStaff API is running',
    };
  }

  @Get('health/database')
  async getDatabaseHealth() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        success: true,
        message: 'Database connection is working',
      };
    } catch {
      return {
        success: false,
        message: 'Database connection failed',
      };
    }
  }
}