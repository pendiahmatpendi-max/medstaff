import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ClockInDto } from './dto/clock-in.dto';
import { ClockOutDto } from './dto/clock-out.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(
    private readonly attendanceService: AttendanceService,
  ) {}

  @Get('today')
  today(@Req() req: any) {
    return this.attendanceService.getTodayAttendance(
      req.user.sub,
    );
  }

  @Post('clock-in')
  clockIn(
    @Req() req: any,
    @Body() dto: ClockInDto,
  ) {
    return this.attendanceService.clockIn(
      req.user.sub,
      dto,
    );
  }

  @Post('clock-out')
  clockOut(
    @Req() req: any,
    @Body() dto: ClockOutDto,
  ) {
    return this.attendanceService.clockOut(
      req.user.sub,
      dto,
    );
  }

  @Get('history')
  history(@Req() req: any) {
    return this.attendanceService.getHistory(
      req.user.sub,
    );
  }
}
