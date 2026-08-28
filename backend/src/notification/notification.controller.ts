import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { NotificationService } from './notification.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
  ) {}

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  @Get()
  async getMyNotifications(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationService.getMyNotifications(
      req.user.sub,
    );
  }

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  @Get('unread-count')
  async getUnreadCount(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationService.getUnreadCount(
      req.user.sub,
    );
  }

  // =====================================================
  // PREFERENCES
  // =====================================================

  @Get('preferences')
  async getPreferences(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationService.getPreferences(
      req.user.sub,
    );
  }

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  @Patch('read-all')
  async markAllAsRead(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.notificationService.markAllAsRead(
      req.user.sub,
    );
  }

  // =====================================================
  // UPDATE PREFERENCES
  // =====================================================

  @Patch('preferences')
  async updatePreferences(
    @Req() req: AuthenticatedRequest,

    @Body()
    body: {
      attendanceNotification?: boolean;
      leaveNotification?: boolean;
      documentNotification?: boolean;
      announcementNotification?: boolean;
    },
  ) {
    return this.notificationService.updatePreferences(
      req.user.sub,
      body,
    );
  }

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  @Patch(':id/read')
  async markAsRead(
    @Req() req: AuthenticatedRequest,

    @Param('id')
    notificationId: string,
  ) {
    return this.notificationService.markAsRead(
      req.user.sub,
      notificationId,
    );
  }
}