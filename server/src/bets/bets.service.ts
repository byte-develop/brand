import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bets } from './entities/bets.entity';
import { CreateBetseDto } from './dto/create-bets.dto';

@Injectable()
export class BetsService {

  constructor(
    @InjectRepository(Bets)
    private betsRepository: Repository<Bets>,
  ) {}  

  async create(createBetsDto: CreateBetseDto) {
    return await this.betsRepository.save(createBetsDto);
  }

  async findAll() {
    return await this.betsRepository.find();
  }

  async findOne(id: number) {
    return await this.betsRepository.findOne({ where: { id } });
  }

  async findByUID(UID: string) {
    return await this.betsRepository.find({ where: { UID } });
  }
}
