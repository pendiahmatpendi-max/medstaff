import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import {
  FileInterceptor,
} from '@nestjs/platform-express';

import { diskStorage } from 'multer';

import {
  extname,
} from 'path';

import { randomUUID } from 'crypto';

import { UploadService } from './upload.service';

import {
  JwtAuthGuard,
} from '../auth/guards/jwt-auth.guard';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
  ) {}

  // ==========================================
  // PROFILE PHOTO
  // ==========================================

  @Post('profile')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/profiles',

        filename: (
          req,
          file,
          callback,
        ) => {
          const extension =
            extname(file.originalname)
              .toLowerCase();

          callback(
            null,
            `${randomUUID()}${extension}`,
          );
        },
      }),

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (
          !allowedTypes.includes(
            file.mimetype,
          )
        ) {
          return callback(
            new BadRequestException(
              'Format foto harus JPG, PNG, atau WEBP',
            ),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize:
          5 * 1024 * 1024,
      },
    }),
  )
  async uploadProfile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.createResponse(
      file,
      'profiles',
      'Foto profil berhasil diupload',
    );
  }

  // ==========================================
  // ATTENDANCE PHOTO
  // ==========================================

  @Post('attendance')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          './uploads/attendance',

        filename: (
          req,
          file,
          callback,
        ) => {
          const extension =
            extname(file.originalname)
              .toLowerCase();

          callback(
            null,
            `${randomUUID()}${extension}`,
          );
        },
      }),

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
        ];

        if (
          !allowedTypes.includes(
            file.mimetype,
          )
        ) {
          return callback(
            new BadRequestException(
              'Foto absensi harus JPG, PNG, atau WEBP',
            ),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize:
          5 * 1024 * 1024,
      },
    }),
  )
  async uploadAttendance(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.createResponse(
      file,
      'attendance',
      'Foto absensi berhasil diupload',
    );
  }

  // ==========================================
  // LEAVE ATTACHMENT
  // ==========================================

  @Post('leave')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          './uploads/leave',

        filename: (
          req,
          file,
          callback,
        ) => {
          const extension =
            extname(file.originalname)
              .toLowerCase();

          callback(
            null,
            `${randomUUID()}${extension}`,
          );
        },
      }),

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf',
        ];

        if (
          !allowedTypes.includes(
            file.mimetype,
          )
        ) {
          return callback(
            new BadRequestException(
              'Lampiran harus berupa JPG, PNG, WEBP, atau PDF',
            ),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize:
          10 * 1024 * 1024,
      },
    }),
  )
  async uploadLeave(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.createResponse(
      file,
      'leave',
      'Lampiran izin berhasil diupload',
    );
  }

  // ==========================================
  // DOCUMENT
  // ==========================================

  @Post('document')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination:
          './uploads/documents',

        filename: (
          req,
          file,
          callback,
        ) => {
          const extension =
            extname(file.originalname)
              .toLowerCase();

          callback(
            null,
            `${randomUUID()}${extension}`,
          );
        },
      }),

      fileFilter: (
        req,
        file,
        callback,
      ) => {
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/pdf',
        ];

        if (
          !allowedTypes.includes(
            file.mimetype,
          )
        ) {
          return callback(
            new BadRequestException(
              'Dokumen harus berupa JPG, PNG, WEBP, atau PDF',
            ),
            false,
          );
        }

        callback(null, true);
      },

      limits: {
        fileSize:
          10 * 1024 * 1024,
      },
    }),
  )
  async uploadDocument(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.createResponse(
      file,
      'documents',
      'Dokumen berhasil diupload',
    );
  }

  // ==========================================
  // RESPONSE HELPER
  // ==========================================

  private createResponse(
    file:
      | Express.Multer.File
      | undefined,
    folder: string,
    message: string,
  ) {
    if (!file) {
      throw new BadRequestException(
        'File tidak ditemukan',
      );
    }

    return {
      success: true,
      message,

      data: {
        filename: file.filename,

        originalName:
          file.originalname,

        mimeType:
          file.mimetype,

        size:
          file.size,

        url:
          this.uploadService.getFileUrl(
            folder,
            file.filename,
          ),
      },
    };
  }
}