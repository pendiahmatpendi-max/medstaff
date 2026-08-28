import { Module } from '@nestjs/common';

import { LanguageController } from './language.controller';
import { LanguageService } from './language.service';

import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
  ],

  controllers: [
    LanguageController,
  ],

  providers: [
    LanguageService,
  ],

  exports: [
    LanguageService,
  ],
})
export class LanguageModule {}