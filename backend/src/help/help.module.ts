import { Module } from '@nestjs/common';

import { HelpController } from './help.controller';
import { HelpService } from './help.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],

  controllers: [
    HelpController,
  ],

  providers: [
    HelpService,
  ],

  exports: [
    HelpService,
  ],
})
export class HelpModule {}