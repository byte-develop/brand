import { Module } from '@nestjs/common';
import { WorksService } from './works.service';
import { WorksController } from './works.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Works } from './entities/works.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Works])],
  controllers: [WorksController],
  providers: [WorksService],
  exports: [WorksService]
})
export class WorksModule {}
