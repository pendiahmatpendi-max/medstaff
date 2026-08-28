import { Module } from '@nestjs/common';

import { DocumentRequestController } from './document-request.controller';
import { DocumentRequestService } from './document-request.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
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
