import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transfers } from './entities/transfers.entity';
import { CreateTransfersDto } from './dto/create-transfers.dto';

@Injectable()
export class TransfersService {
  constructor(
    @InjectRepository(Transfers)
    private transfersRepository: Repository<Transfers>,
  ) { }

  async create(createTransfersDto: CreateTransfersDto): Promise<Transfers> {
    const transfers = this.transfersRepository.create({ ...createTransfersDto});
    const savedTransfers = await this.transfersRepository.save(transfers);
    
    return savedTransfers;
  }

  async findAll({ id_user }: { id_user?: string }): Promise<Transfers[]> {
    const query = this.transfersRepository.createQueryBuilder('transfers');

    if (id_user) {
      query.andWhere('transfers.id_user = :id_user', { id_user });
    }

    query.orderBy('transfers.date', 'DESC');
 
    return await query.getMany();
  }

}
