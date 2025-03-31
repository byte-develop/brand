import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Forms } from './entities/shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Forms])],
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [ShopsService, TypeOrmModule]
})
export class ShopsModule {}
