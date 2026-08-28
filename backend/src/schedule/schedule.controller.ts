import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(
    private readonly scheduleService: ScheduleService,
  ) {}

  // =========================
  // STAFF
  // =========================

  @Get('today')
  @UseGuards(JwtAuthGuard)
  today(@Req() req: any) {
    return this.scheduleService.getTodaySchedule(
      req.user.sub,
    );
  }

  @Get('month')
  @UseGuards(JwtAuthGuard)
  month(
    @Req() req: any,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.scheduleService.getEmployeeSchedule(
      req.user.sub,
      Number(year),
      Number(month),
    );
  }

  // =========================
  // ADMIN
  // =========================

  @Get('admin/employees')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getEmployees() {
    return this.scheduleService.getEmployeesForAdmin();
  }

  @Post('admin')
  @UseGuards(JwtAuthGuard, AdminGuard)
  create(@Body() dto: CreateScheduleDto) {
    return this.scheduleService.create(dto);
  }

  @Get('admin/month')
  @UseGuards(JwtAuthGuard, AdminGuard)
  monthAdmin(
    @Query('employeeId') employeeId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.scheduleService.getEmployeeScheduleById(
      employeeId,
      Number(year),
      Number(month),
    );
  }
}
