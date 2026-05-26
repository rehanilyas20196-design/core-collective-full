import { Body, Controller, Post } from '@nestjs/common';
import { SupplierInquiriesService } from './supplier-inquiries.service';
import { CreateInquiryDto } from '../common/dto/inquiry.dto';

@Controller('supplier-inquiries')
export class SupplierInquiriesController {
  constructor(private readonly supplierInquiriesService: SupplierInquiriesService) {}

  @Post()
  async create(@Body() body: CreateInquiryDto) {
    return this.supplierInquiriesService.create(body);
  }
}
