import { Module } from '@nestjs/common';

import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    NotificationModule,
  ],

  controllers: [
    LeaveController,
  ],

  providers: [
    LeaveService,
  ],

  exports: [
    LeaveService,
  ],
})
export class LeaveModule {}