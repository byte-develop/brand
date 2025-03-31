import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Forms } from './entities/shop.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Forms)
    private shopsRepository: Repository<Forms>,
  ) { }

  async findAll({ city, searchTerm, recommended }): Promise<Forms[]> {
    const query = this.shopsRepository.createQueryBuilder('shop');

    if (recommended) {
      query.andWhere('shop.recommended = :recommended', { recommended: true });
    }

    if (city) {
      query.andWhere('shop.city = :city', { city });
    }

    if (searchTerm) {
      query.andWhere('LOWER(shop.name) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm.toLowerCase()}%` });
    }

    return await query.getMany();
  }

  async findById(id: number): Promise<Forms | null> {
    return await this.shopsRepository.findOne({ where: { id } });
  }
}