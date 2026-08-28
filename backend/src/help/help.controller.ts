import {
  Controller,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';

import { HelpService } from './help.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('help')
@UseGuards(JwtAuthGuard)
export class HelpController {
  constructor(
    private readonly helpService: HelpService,
  ) {}

  // =====================================================
  // GET ALL ARTICLES
  // =====================================================

  @Get()
  async getAll() {
    return this.helpService.getAll();
  }

  // =====================================================
  // GET ARTICLE DETAIL
  // =====================================================

  @Get(':id')
  async getById(
    @Param('id') id: string,
  ) {
    return this.helpService.getById(id);
  }
}