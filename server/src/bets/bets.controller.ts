import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus } from '@nestjs/common';
import { BetsService } from './bets.service';
import { CreateBetseDto } from './dto/create-bets.dto';


@Controller('bets')
export class BetsController {

  constructor(private readonly betsService: BetsService) {}

  @Post()
  async create(@Body() createBetsDto: CreateBetseDto) {
    try {
      return await this.betsService.create(createBetsDto);
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании ставки',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  findAll() {
    return this.betsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.betsService.findOne(+id);
  }

  @Get('UID/:UID')
  findByUID(@Param('UID') UID: string) {
    return this.betsService.findByUID(UID);
  }
}
