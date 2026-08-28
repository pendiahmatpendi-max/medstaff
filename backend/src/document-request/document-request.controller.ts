import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { DocumentRequestService } from './document-request.service';
import { CreateDocumentRequestDto } from './dto/create-document-request.dto';
import { ReviewDocumentRequestDto } from './dto/review-document-request.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('document-request')
@UseGuards(JwtAuthGuard)
export class DocumentRequestController {
  constructor(
    private readonly documentRequestService: DocumentRequestService,
  ) {}

  // =========================
  // STAFF
  // =========================

  @Post()
  create(
    @Req() req: any,
    @Body() dto: CreateDocumentRequestDto,
  ) {
    return this.documentRequestService.create(
      req.user.sub,
      dto,
    );
  }

  @Get('my')
  getMyRequests(@Req() req: any) {
    return this.documentRequestService.getMyRequests(
      req.user.sub,
    );
  }

  @Get('my/:id')
  getMyRequestById(
    @Req() req: any,
    @Param('id') requestId: string,
  ) {
    return this.documentRequestService.getMyRequestById(
      req.user.sub,
      requestId,
    );
  }

  // =========================
  // ADMIN
  // =========================

  @Get('admin')
  @UseGuards(AdminGuard)
  getAll() {
    return this.documentRequestService.getAll();
  }

  @Patch('admin/:id/review')
  @UseGuards(AdminGuard)
  review(
    @Req() req: any,
    @Param('id') requestId: string,
    @Body() dto: ReviewDocumentRequestDto,
  ) {
    return this.documentRequestService.review(
      req.user.sub,
      requestId,
      dto,
    );
  }
}
