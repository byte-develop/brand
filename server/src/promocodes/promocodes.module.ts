import { Module } from '@nestjs/common';
import { PromocodeService } from './promocodes.service';
import { Promocode } from './entities/promocodes.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromocodeController } from './promocodes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Promocode])],
  controllers: [PromocodeController], 
  providers: [PromocodeService],
})
export class PromocodekModule {}
