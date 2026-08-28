import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { AttendActivityDto } from './dto/attend-activity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController {
  constructor(
    private readonly activityService: ActivityService,
  ) {}

  @Get()
  getActivities() {
    return this.activityService.getActivities();
  }

  @Get('today')
  getTodayActivities() {
    return this.activityService.getTodayActivities();
  }

  @Get('my-attendance')
  getMyAttendance(@Req() req: any) {
    return this.activityService.getMyAttendance(
      req.user.sub,
    );
  }

  @Post(':id/attend')
  attend(
    @Req() req: any,
    @Param('id') activityId: string,
    @Body() dto: AttendActivityDto,
  ) {
    return this.activityService.attend(
      req.user.sub,
      activityId,
      dto,
    );
  }

  @Post()
  @UseGuards(AdminGuard)
  create(
    @Req() req: any,
    @Body() dto: CreateActivityDto,
  ) {
    return this.activityService.create(
      req.user.sub,
      dto,
    );
  }
}
