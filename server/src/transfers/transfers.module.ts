import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransfersController } from './transfers.controller';
import { TransfersService } from './transfers.service';
import { Transfers } from './entities/transfers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transfers])],
  controllers: [TransfersController], 
  providers: [TransfersService],
})
export class TransfersModule {}
