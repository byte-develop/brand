import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bets } from './entities/bets.entity';
import { BetsController } from './bets.controller';
import { BetsService } from './bets.service';


@Module({
  imports: [TypeOrmModule.forFeature([Bets])],
  controllers: [BetsController], 
  providers: [BetsService],
})
export class BetsModule {}
