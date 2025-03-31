import { Controller, Get, Query } from '@nestjs/common';
import { Promocode } from './entities/promocodes.entity';
import { PromocodeService } from './promocodes.service';

@Controller('promocode')
export class PromocodeController {
    constructor(private readonly promocodesService: PromocodeService) { }

    @Get()
    async getAllPromocodes(@Query('userid') userid?: string): Promise<Promocode[]> {
        return this.promocodesService.findAll({ userid });
    }
}
