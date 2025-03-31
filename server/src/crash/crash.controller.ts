import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Crash } from 'src/miner/entities/crash.entity';
import { CrashService } from './crash.service';

@Controller('crash')
export class CrashController {
  constructor(private readonly crashService: CrashService) {}

  @Get('game-state')
  async getGameState() {
    return this.crashService.getGameState();
  }

  @Get('time-left') 
  async getTimeLeft() {
    return this.crashService.getTimeLeft();
  }

  @Get('result')
  async getResult() {
    return this.crashService.getResult();
  }
}
