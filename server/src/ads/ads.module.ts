import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdsController } from './ads.controller';
import { Ads } from './entities/ads.entity';
import { AdsService } from './ads.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ads])],
  controllers: [AdsController],
  providers: [AdsService],
  exports: [AdsService]
})
export class AdsModule {}
