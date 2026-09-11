import { Module } from '@nestjs/common';

import { DocumentRequestController } from './document-request.controller';
import { DocumentRequestService } from './document-request.service';

import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    NotificationModule,
    PrismaModule,
    AuthModule,
  ],

  controllers: [
    DocumentRequestController,
  ],

  providers: [
    DocumentRequestService,
  ],

  exports: [
    DocumentRequestService,
  ],
})
export class DocumentRequestModule {}

