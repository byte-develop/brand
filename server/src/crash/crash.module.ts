import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Crash } from 'src/miner/entities/crash.entity';
import { CrashService } from './crash.service';
import { CrashController } from './crash.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Crash])],
  controllers: [CrashController], 
  providers: [CrashService],
})
export class CrashModule {}
