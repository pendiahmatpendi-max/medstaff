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

import { LeaveService } from './leave.service';
import { CreateLeaveDto } from './dto/create-leave.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('leave')
@UseGuards(JwtAuthGuard)
export class LeaveController {
  constructor(
    private readonly leaveService: LeaveService,
  ) {}

  // =========================
  // STAFF
  // =========================

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateLeaveDto,
  ) {
    return this.leaveService.create(
      req.user.sub,
      dto,
    );
  }

  @Get('my')
  getMyLeaves(
    @Req() req: any,
  ) {
    return this.leaveService.getMyLeaves(
      req.user.sub,
    );
  }

  @Get('my/:id')
  getMyLeaveById(
    @Req() req: any,
    @Param('id') leaveId: string,
  ) {
    return this.leaveService.getMyLeaveById(
      req.user.sub,
      leaveId,
    );
  }

  // =========================
  // ADMIN
  // =========================

  @Get('admin')
  @UseGuards(AdminGuard)
  getAll() {
    return this.leaveService.getAll();
  }

  @Patch('admin/:id/approve')
  @UseGuards(AdminGuard)
  approve(
    @Req() req: any,
    @Param('id') leaveId: string,
    @Body('adminNote') adminNote?: string,
  ) {
    return this.leaveService.approve(
      req.user.sub,
      leaveId,
      adminNote,
    );
  }

  @Patch('admin/:id/reject')
  @UseGuards(AdminGuard)
  reject(
    @Req() req: any,
    @Param('id') leaveId: string,
    @Body('adminNote') adminNote?: string,
  ) {
    return this.leaveService.reject(
      req.user.sub,
      leaveId,
      adminNote,
    );
  }
}