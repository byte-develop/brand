import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RouletteService } from './roulette.service';


@Controller('roulette')
export class RouletteController {
  constructor(private readonly rouletteService: RouletteService) {}

  @Get('game-state')
  async getGameState() {
    return this.rouletteService.getGameState();
  }

  @Get('time-left') 
  async getTimeLeft() {
    return this.rouletteService.getTimeLeft();
  }

  @Get('result')
  async getResult() {
    return this.rouletteService.getResult();
  }
}
