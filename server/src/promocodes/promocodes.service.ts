import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramService } from 'src/telegramBot';
import { Promocode } from './entities/promocodes.entity';

@Injectable()
export class PromocodeService {
    constructor(
        @InjectRepository(Promocode)
        private promocodesRepository: Repository<Promocode>,
      ) { }

    async findAll({ userid }: { userid?: string }): Promise<Promocode[]> {
        const query = this.promocodesRepository.createQueryBuilder('promocodes');

        if (userid) {
            query.andWhere('promocodes.userid = :userid', { userid });
        }

        query.orderBy('promocodes.datetime', 'DESC');

        return await query.getMany();
    }
}
