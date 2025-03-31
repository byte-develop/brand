import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AdsService } from './ads.service';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Get('catalog_start')
  async getCatalogStartAds(): Promise<any> {
    return this.adsService.getCatalogStartAds();
  }

  @Get('catalog_middle')
  async getCatalogMiddleAds(): Promise<any> {
    return this.adsService.getCatalogMiddleAds();
  }

  @Get('catalog_end')
  async getCatalogEndAds(): Promise<any> {
    return this.adsService.getCatalogEndAds();
  }

  @Get('games')
  async getGamesAds(): Promise<any> {
    return this.adsService.getGamesAds();
  }

  @Get('profile')
  async getProfileAds(): Promise<any> {
    return this.adsService.getProfileAds();
  }
}
