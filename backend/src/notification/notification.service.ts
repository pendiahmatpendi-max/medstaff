import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =====================================================
  // GET MY NOTIFICATIONS
  // =====================================================

  async getMyNotifications(userId: string) {
    const notifications =
      await this.prisma.notification.findMany({
        where: {
          userId,
        },

        orderBy: {
          createdAt: 'desc',
        },
      });

    return {
      success: true,
      data: notifications,
    };
  }

  // =====================================================
  // GET UNREAD COUNT
  // =====================================================

  async getUnreadCount(userId: string) {
    const count =
      await this.prisma.notification.count({
        where: {
          userId,
          isRead: false,
        },
      });

    return {
      success: true,
      data: {
        count,
      },
    };
  }

  // =====================================================
  // MARK ONE AS READ
  // =====================================================

  async markAsRead(
    userId: string,
    notificationId: string,
  ) {
    const notification =
      await this.prisma.notification.findFirst({
        where: {
          id: notificationId,
          userId,
        },
      });

    if (!notification) {
      throw new NotFoundException(
        'Notifikasi tidak ditemukan',
      );
    }

    const updated =
      await this.prisma.notification.update({
        where: {
          id: notificationId,
        },

        data: {
          isRead: true,
        },
      });

    return {
      success: true,
      message:
        'Notifikasi ditandai sudah dibaca',
      data: updated,
    };
  }

  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        isRead: false,
      },

      data: {
        isRead: true,
      },
    });

    return {
      success: true,
      message:
        'Semua notifikasi ditandai sudah dibaca',
    };
  }

  // =====================================================
  // CREATE NOTIFICATION
  // =====================================================

  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    referenceId?: string,
  ) {
    const notification =
      await this.prisma.notification.create({
        data: {
          userId,
          title,
          message,
          type,
          referenceId,
        },
      });

    return notification;
  }

  // =====================================================
  // GET NOTIFICATION PREFERENCE
  // =====================================================

  async getPreferences(userId: string) {
    let preference =
      await this.prisma.notificationPreference.findUnique({
        where: {
          userId,
        },
      });

    // Jika belum ada, buat default
    if (!preference) {
      preference =
        await this.prisma.notificationPreference.create({
          data: {
            userId,
            attendanceNotification: true,
            leaveNotification: true,
            documentNotification: true,
            announcementNotification: true,
          },
        });
    }

    return {
      success: true,
      data: preference,
    };
  }

  // =====================================================
  // UPDATE NOTIFICATION PREFERENCE
  // =====================================================

  async updatePreferences(
    userId: string,
    data: {
      attendanceNotification?: boolean;
      leaveNotification?: boolean;
      documentNotification?: boolean;
      announcementNotification?: boolean;
    },
  ) {
    const preference =
      await this.prisma.notificationPreference.upsert({
        where: {
          userId,
        },

        create: {
          userId,

          attendanceNotification:
            data.attendanceNotification ?? true,

          leaveNotification:
            data.leaveNotification ?? true,

          documentNotification:
            data.documentNotification ?? true,

          announcementNotification:
            data.announcementNotification ?? true,
        },

        update: {
          ...(data.attendanceNotification !== undefined && {
            attendanceNotification:
              data.attendanceNotification,
          }),

          ...(data.leaveNotification !== undefined && {
            leaveNotification:
              data.leaveNotification,
          }),

          ...(data.documentNotification !== undefined && {
            documentNotification:
              data.documentNotification,
          }),

          ...(data.announcementNotification !== undefined && {
            announcementNotification:
              data.announcementNotification,
          }),
        },
      });

    return {
      success: true,
      message:
        'Preferensi notifikasi berhasil diperbarui',
      data: preference,
    };
  }
}