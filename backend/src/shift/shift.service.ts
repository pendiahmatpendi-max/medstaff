import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShiftDto } from './dto/create-shift.dto';

@Injectable()
export class ShiftService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const shifts = await this.prisma.shift.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return {
      success: true,
      message: 'Daftar shift berhasil diambil',
      data: shifts,
    };
  }

  async create(dto: CreateShiftDto) {
    if (!/^\d{2}:\d{2}$/.test(dto.startTime)) {
      throw new BadRequestException(
        'startTime harus menggunakan format HH:mm',
      );
    }

    if (!/^\d{2}:\d{2}$/.test(dto.endTime)) {
      throw new BadRequestException(
        'endTime harus menggunakan format HH:mm',
      );
    }

    const shift = await this.prisma.shift.create({
      data: {
        name: dto.name,
        category: dto.category,
        startTime: dto.startTime,
        endTime: dto.endTime,
        crossesMidnight: dto.crossesMidnight ?? false,
      },
    });

    return {
      success: true,
      message: 'Shift berhasil dibuat',
      data: shift,
    };
  }
}
