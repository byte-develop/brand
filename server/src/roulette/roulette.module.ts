import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roulette } from './entities/roulette.entity';
import { RouletteController } from './roulette.controller';
import { RouletteService } from './roulette.service';

@Module({
  imports: [TypeOrmModule.forFeature([Roulette])],
  controllers: [RouletteController], 
  providers: [RouletteService],
})
export class RouletteModule {}
