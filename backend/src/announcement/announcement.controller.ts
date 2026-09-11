import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AnnouncementService } from './announcement.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('announcements')
@UseGuards(JwtAuthGuard)
export class AnnouncementController {
  constructor(
    private readonly announcementService: AnnouncementService,
  ) {}

  // STAFF / ADMIN
  // Hanya pengumuman yang sudah diterbitkan
  @Get()
  getAnnouncements() {
    return this.announcementService.getAnnouncements();
  }

  // ADMIN
  // Semua termasuk draft
  @Get('all')
  @UseGuards(AdminGuard)
  getAllAnnouncements() {
    return this.announcementService.getAllAnnouncements();
  }

  // ADMIN
  @Post()
  @UseGuards(AdminGuard)
  create(
    @Req() req: any,
    @Body() body: any,
  ) {
    return this.announcementService.create(
      req.user.sub,
      body,
    );
  }

  // ADMIN
  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.announcementService.update(
      id,
      body,
    );
  }

  // ADMIN
  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(
    @Param('id') id: string,
  ) {
    return this.announcementService.remove(id);
  }
}
