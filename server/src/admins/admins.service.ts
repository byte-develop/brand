import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Admins } from './entities/admins.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admins)
    private homeRepository: Repository<Admins>,
  ) { }

  async findAll(): Promise<Admins[]> {
    const query = this.homeRepository.createQueryBuilder('admins');

    return await query.getMany();
  }
}