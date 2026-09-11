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

    const announcement =
      await this.prisma.announcement.create({
        data: {
          title,
          content,
          image: body.image || null,
          createdBy: userId,
          publishedAt:
            body.published === false
              ? null
              : new Date(),
        },
      });

    return {
      success: true,
      message:
        body.published === false
          ? 'Draft pengumuman berhasil dibuat'
          : 'Pengumuman berhasil diterbitkan',
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

    if (body.published !== undefined) {
      data.publishedAt = body.published
        ? existing.publishedAt || new Date()
        : null;
    }

    const announcement =
      await this.prisma.announcement.update({
        where: { id },
        data,
      });

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
}
