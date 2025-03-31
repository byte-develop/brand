import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { Transfers } from './entities/transfers.entity';
import { CreateTransfersDto } from './dto/create-transfers.dto';
import { TransfersService } from './transfers.service';

@Controller('transfers')
export class TransfersController {
  constructor(private readonly transfersService: TransfersService  ) { }

  @Post()
  async create(@Body() createTransfersDto: CreateTransfersDto): Promise<Transfers> {
    return this.transfersService.create(createTransfersDto);
  }

  @Get()
  async getAllTransfers(
    @Query('id_user') id_user?: string,
  ): Promise<Transfers[]> {
    return this.transfersService.findAll({ id_user });
  }
}
