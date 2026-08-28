import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ScheduleModule } from './schedule/schedule.module';
import { EmployeeModule } from './employees/employee.module';
import { ShiftModule } from './shift/shift.module';
import { ActivityModule } from './activity/activity.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { LeaveModule } from './leave/leave.module';
import { DocumentRequestModule } from './document-request/document-request.module';
import { NotificationModule } from './notification/notification.module';
import { LanguageModule } from './language/language.module';
import { HelpModule } from './help/help.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    PrismaModule,
    AuthModule,

    EmployeeModule,
    AttendanceModule,
    ScheduleModule,
    ShiftModule,
    ActivityModule,

    DashboardModule,

    LeaveModule,
    DocumentRequestModule,

    NotificationModule,

    LanguageModule,
    HelpModule,
    UploadModule,
  ],

  controllers: [AppController],

  providers: [],
})
export class AppModule {}
