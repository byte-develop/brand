import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sales } from './entities/sales.entity';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Get()
  async getAllWorks(
    @Query('city') city?: string,
  ): Promise<Sales[]> {
    return this.salesService.findAll({ city });
  }
}