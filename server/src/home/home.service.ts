import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Home } from './entities/home.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(Home)
    private homeRepository: Repository<Home>,
  ) { }

  async findAll(): Promise<Home[]> {
    const query = this.homeRepository.createQueryBuilder('home');

    return await query.getMany();
  }
}