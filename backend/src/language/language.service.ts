import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =====================================================
  // GET AVAILABLE LANGUAGES
  // =====================================================

  async getLanguages() {
    const languages =
      await this.prisma.language.findMany({
        orderBy: {
          name: 'asc',
        },
      });

    return {
      success: true,
      data: languages,
    };
  }

  // =====================================================
  // GET MY LANGUAGE
  // =====================================================

  async getMyLanguage(userId: string) {
    const userLanguage =
      await this.prisma.userLanguage.findUnique({
        where: {
          userId,
        },
        include: {
          language: true,
        },
      });

    // Default Bahasa Indonesia
    if (!userLanguage) {
      let language =
        await this.prisma.language.findUnique({
          where: {
            code: 'id',
          },
        });

      // Jika bahasa id belum ada, buat
      if (!language) {
        language =
          await this.prisma.language.create({
            data: {
              code: 'id',
              name: 'Bahasa Indonesia',
            },
          });
      }

      return {
        success: true,
        data: {
          language,
        },
      };
    }

    return {
      success: true,
      data: userLanguage,
    };
  }

  // =====================================================
  // SET MY LANGUAGE
  // =====================================================

  async setMyLanguage(
    userId: string,
    code: string,
  ) {
    if (!code || typeof code !== 'string') {
      throw new BadRequestException(
        'Kode bahasa wajib diisi',
      );
    }

    const language =
      await this.prisma.language.findUnique({
        where: {
          code,
        },
      });

    if (!language) {
      throw new NotFoundException(
        'Bahasa tidak tersedia',
      );
    }

    const userLanguage =
      await this.prisma.userLanguage.upsert({
        where: {
          userId,
        },

        create: {
          userId,
          languageId: language.id,
        },

        update: {
          languageId: language.id,
        },

        include: {
          language: true,
        },
      });

    return {
      success: true,
      message: 'Bahasa berhasil diperbarui',
      data: userLanguage,
    };
  }
}