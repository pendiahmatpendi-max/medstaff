import {
  Controller,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';

import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  /**
   * Dashboard STAFF
   *
   * GET /dashboard/staff
   */
  @Get('staff')
  getStaffDashboard(
    @Req() req: any,
  ) {
    return this.dashboardService.getStaffDashboard(
      req.user.sub,
    );
  }

  /**
   * Dashboard ADMIN
   *
   * GET /dashboard/admin
   */
  @Get('admin')
  @UseGuards(AdminGuard)
  getAdminDashboard() {
    return this.dashboardService.getAdminDashboard();
  }
}