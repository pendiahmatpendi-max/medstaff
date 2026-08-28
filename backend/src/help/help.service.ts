import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HelpService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // =====================================================
  // GET ALL HELP ARTICLES
  // =====================================================

  async getAll() {
    const articles =
      await this.prisma.helpArticle.findMany({
        orderBy: {
          title: 'asc',
        },
      });

    return {
      success: true,
      message: 'Daftar artikel bantuan berhasil diambil',
      data: articles,
    };
  }

  // =====================================================
  // GET HELP ARTICLE DETAIL
  // =====================================================

  async getById(id: string) {
    const article =
      await this.prisma.helpArticle.findUnique({
        where: {
          id,
        },
      });

    if (!article) {
      throw new NotFoundException(
        'Artikel bantuan tidak ditemukan',
      );
    }

    return {
      success: true,
      message: 'Detail artikel bantuan berhasil diambil',
      data: article,
    };
  }
}