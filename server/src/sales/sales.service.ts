import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sales } from './entities/sales.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sales)
    private salesRepository: Repository<Sales>,
  ) { }

  async findAll({city}): Promise<Sales[]> {
    const query = this.salesRepository.createQueryBuilder('sales');

    if (city) {
      query.andWhere('sales.city = :city', { city });
    }

    return await query.getMany();
  }
}