import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { Home } from './entities/home.entity';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getAllShops(): Promise<Home[]> { 
    return this.homeService.findAll();
  }
}