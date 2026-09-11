import { Module } from '@nestjs/common';

import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
