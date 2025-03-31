import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { Forms } from './entities/shop.entity';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get()
  async getAllShops(
    @Query('cityall') city?: string,
    @Query('searchTerm') searchTerm?: string,
    @Query('recommended') recommended?: boolean,
  ): Promise<Forms[]> {
    return this.shopsService.findAll({city, searchTerm, recommended });
  }

  @Get(':id')
  async getShopById(@Param('id') id: number): Promise<Forms> {
    return this.shopsService.findById(id);
  }
}