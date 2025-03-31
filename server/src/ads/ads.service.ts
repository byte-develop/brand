import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ads } from './entities/ads.entity';

@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ads)
    private adsRepository: Repository<Ads>,
  ) { }

  async getCatalogStartAds(): Promise<Ads[]> {
    return this.adsRepository.find({ where: { place: 'catalog_start' } });
  }

  async getCatalogMiddleAds(): Promise<Ads[]> {
    return this.adsRepository.find({ where: { place: 'catalog_middle' } });
  }

  async getCatalogEndAds(): Promise<Ads[]> {
    return this.adsRepository.find({ where: { place: 'catalog_end' } });
  }

  async getGamesAds(): Promise<Ads[]> {
    return this.adsRepository.find({ where: { place: 'games' } });
  }

  async getProfileAds(): Promise<Ads[]> {
    return this.adsRepository.find({ where: { place: 'profile' } });
  }
}
