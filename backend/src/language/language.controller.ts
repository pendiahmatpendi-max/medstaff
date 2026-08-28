import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { LanguageService } from './language.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Controller('language')
@UseGuards(JwtAuthGuard)
export class LanguageController {
  constructor(
    private readonly languageService: LanguageService,
  ) {}

  // =====================================================
  // AVAILABLE LANGUAGES
  // =====================================================

  @Get()
  async getLanguages() {
    return this.languageService.getLanguages();
  }

  // =====================================================
  // MY LANGUAGE
  // =====================================================

  @Get('me')
  async getMyLanguage(
    @Req() req: AuthenticatedRequest,
  ) {
    return this.languageService.getMyLanguage(
      req.user.sub,
    );
  }

  // =====================================================
  // CHANGE LANGUAGE
  // =====================================================

  @Patch('me')
  async setMyLanguage(
    @Req() req: AuthenticatedRequest,

    @Body()
    body: {
      code: string;
    },
  ) {
    return this.languageService.setMyLanguage(
      req.user.sub,
      body.code,
    );
  }
}