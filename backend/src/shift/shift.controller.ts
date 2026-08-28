import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ShiftService } from './shift.service';
import { CreateShiftDto } from './dto/create-shift.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('shifts')
@UseGuards(JwtAuthGuard, AdminGuard)
export class ShiftController {
  constructor(private readonly shiftService: ShiftService) {}

  @Get()
  getAll() {
    return this.shiftService.getAll();
  }

  @Post()
  create(@Body() dto: CreateShiftDto) {
    return this.shiftService.create(dto);
  }
}
