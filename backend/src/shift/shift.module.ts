import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],
  controllers: [ShiftController],
  providers: [ShiftService],
})
export class ShiftModule {}
