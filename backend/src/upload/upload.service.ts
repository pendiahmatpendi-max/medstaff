import {
  Injectable,
} from '@nestjs/common';

@Injectable()
export class UploadService {
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