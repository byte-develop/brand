import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { WorksService } from './works.service';
import { Works } from './entities/works.entity';

@Controller('works')
export class WorksController {
  constructor(private readonly worksService: WorksService) {}

  @Get()
  async getAllWorks(
    @Query('category') category?: string,
    @Query('city') city?: string,
    @Query('position') position?: string,
    @Query('searchTerm') searchTerm?: string,
  ): Promise<Works[]> {
    return this.worksService.findAll({ category, city, searchTerm, position });
  }

  @Get(':id')
  async getWorkById(@Param('id') id: number): Promise<Works> {
    return this.worksService.findById(id);
  }
}