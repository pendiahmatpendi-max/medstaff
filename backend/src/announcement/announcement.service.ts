import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // STAFF / ADMIN - AMBIL PENGUMUMAN YANG SUDAH TERBIT
  async getAnnouncements() {
    const announcements =
      await this.prisma.announcement.findMany({
        where: {
          publishedAt: {
            not: null,
          },
        },
        orderBy: {
          publishedAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          image: true,
          createdBy: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
          creator: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

    return {
      success: true,
      message: 'Daftar pengumuman berhasil diambil',
      data: announcements,
    };
  }

  // ADMIN - SEMUA PENGUMUMAN
  async getAllAnnouncements() {
    const announcements =
      await this.prisma.announcement.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          image: true,
          createdBy: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return {
      success: true,
      message: 'Semua pengumuman berhasil diambil',
      data: announcements,
    };
  }

  // ADMIN - BUAT PENGUMUMAN
  async create(
    userId: string,
    body: {
      title: string;
      content: string;
      image?: string;
      published?: boolean;
    },
  ) {
    const title = body.title?.trim();
    const content = body.content?.trim();

    if (!title || !content) {
      return {
        success: false,
        message: 'Judul dan isi pengumuman wajib diisi',
        data: null,
      };
    }

    const isPublished = body.published !== false;

    const announcement =
      await this.prisma.announcement.create({
        data: {
          title,
          content,
          image: body.image || null,
          createdBy: userId,
          publishedAt: isPublished
            ? new Date()
            : null,
        },
      });

    // Pengumuman yang langsung diterbitkan
    // akan membuat notifikasi untuk semua STAFF
    if (isPublished) {
      await this.notifyAllStaff(
        title,
        content,
        announcement.id,
      );
    }

    return {
      success: true,
      message: isPublished
        ? 'Pengumuman berhasil diterbitkan'
        : 'Draft pengumuman berhasil dibuat',
      data: announcement,
    };
  }

  // ADMIN - UPDATE
  async update(
    id: string,
    body: {
      title?: string;
      content?: string;
      image?: string;
      published?: boolean;
    },
  ) {
    const existing =
      await this.prisma.announcement.findUnique({
        where: { id },
      });

    if (!existing) {
      return {
        success: false,
        message: 'Pengumuman tidak ditemukan',
        data: null,
      };
    }

    const data: Record<string, any> = {};

    if (body.title !== undefined) {
      data.title = body.title.trim();
    }

    if (body.content !== undefined) {
      data.content = body.content.trim();
    }

    if (body.image !== undefined) {
      data.image = body.image || null;
    }

    const wasPublished = existing.publishedAt !== null;
    let isNowPublished = wasPublished;

    if (body.published !== undefined) {
      isNowPublished = body.published;

      data.publishedAt = body.published
        ? existing.publishedAt || new Date()
        : null;
    }

    const announcement =
      await this.prisma.announcement.update({
        where: { id },
        data,
      });

    // Hanya kirim notifikasi ketika:
    // Draft -> Terbit
    if (!wasPublished && isNowPublished) {
      await this.notifyAllStaff(
        announcement.title,
        announcement.content,
        announcement.id,
      );
    }

    return {
      success: true,
      message: 'Pengumuman berhasil diperbarui',
      data: announcement,
    };
  }

  // ADMIN - HAPUS
  async remove(id: string) {
    const existing =
      await this.prisma.announcement.findUnique({
        where: { id },
      });

    if (!existing) {
      return {
        success: false,
        message: 'Pengumuman tidak ditemukan',
        data: null,
      };
    }

    await this.prisma.announcement.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'Pengumuman berhasil dihapus',
      data: null,
    };
  }

  // =====================================================
  // BUAT NOTIFIKASI UNTUK SEMUA STAFF
  // =====================================================

  private async notifyAllStaff(
    title: string,
    message: string,
    referenceId: string,
  ) {
    const staffUsers =
      await this.prisma.user.findMany({
        where: {
          role: 'STAFF',
          isActive: true,
        },
        select: {
          id: true,
        },
      });

    if (staffUsers.length === 0) {
      return;
    }

    const preferences =
      await this.prisma.notificationPreference.findMany({
        where: {
          userId: {
            in: staffUsers.map((user) => user.id),
          },
        },
        select: {
          userId: true,
          announcementNotification: true,
        },
      });

    const preferenceMap = new Map(
      preferences.map((item) => [
        item.userId,
        item.announcementNotification,
      ]),
    );

    const data = staffUsers
      .filter(
        (user) =>
          preferenceMap.get(user.id) !== false,
      )
      .map((user) => ({
        userId: user.id,
        title,
        message,
        type: 'announcement',
        referenceId,
      }));

    if (data.length > 0) {
      await this.prisma.notification.createMany({
        data,
      });
    }
  }
}
