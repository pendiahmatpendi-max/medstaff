import { Module } from '@nestjs/common';

import { AnnouncementController } from './announcement.controller';
import { AnnouncementService } from './announcement.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [
    AnnouncementController,
  ],
  providers: [
    AnnouncementService,
  ],
  exports: [
    AnnouncementService,
  ],
})
export class AnnouncementModule {}
