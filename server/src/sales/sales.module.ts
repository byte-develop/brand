import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sales } from './entities/sales.entity';
import { SalesService } from './sales.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sales])],
  controllers: [SalesController],
  providers: [SalesService],
  exports: [SalesService]
})
export class SalesModule {}
