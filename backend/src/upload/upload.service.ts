import {
  Injectable,
} from '@nestjs/common';

import {
  put,
} from '@vercel/blob';

@Injectable()
export class UploadService {

  async uploadFile(
    folder: string,
    filename: string,
    buffer: Buffer,
    contentType: string,
  ) {
    const pathname =
      `medstaff/${folder}/${filename}`;

    return await put(
      pathname,
      buffer,
      {
        access: 'private',
        contentType,
        addRandomSuffix: false,
      },
    );
  }

  getFileUrl(
    folder: string,
    filename: string,
  ): string {
    return `/uploads/${folder}/${filename}`;
  }

  getFullFileUrl(
    baseUrl: string,
    folder: string,
    filename: string,
  ): string {
    return `${baseUrl}/uploads/${folder}/${filename}`;
  }
}