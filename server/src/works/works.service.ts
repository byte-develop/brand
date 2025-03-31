import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Works } from './entities/works.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorksService implements OnModuleInit {
  constructor(
    @InjectRepository(Works)
    private worksRepository: Repository<Works>,
  ) { }

  async findAll({ category, city, searchTerm, position }): Promise<Works[]> {
    const query = this.worksRepository.createQueryBuilder('works');

    if (category) {
      query.andWhere('works.category = :category', { category });
    }

    if (city) {
      query.andWhere('works.city = :city', { city });
    }

    if (position) {
      query.andWhere('works.position = :position', { position });
    }

    if (searchTerm) {
      query.andWhere('LOWER(works.name) LIKE LOWER(:searchTerm)', { searchTerm: `%${searchTerm.toLowerCase()}%` });
    }

    return await query.getMany();
  }

  async findById(id: number): Promise<Works | null> {
    return await this.worksRepository.findOne({ where: { id } });
  }

  async updatePositionNumbers(): Promise<void> {
    const works = await this.worksRepository.find();
    const currentDate = new Date();

    works.forEach((work) => {
      const workDate = new Date(work.date);
      if ((currentDate.getTime() - workDate.getTime()) > 18000000) {
        work.position_numer = 1;
        work.date = currentDate;
      }
    });

    const sortedWorks = works.sort((a, b) => a.position_numer - b.position_numer);

    sortedWorks.forEach((work, index) => {
      work.position_numer = index + 1;
    });

    await this.worksRepository.save(sortedWorks);
  }

  onModuleInit() {
    setInterval(() => {
      this.updatePositionNumbers().catch(err => console.error(err));
    }, 7200000);
  }
}