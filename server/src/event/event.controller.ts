import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Ip } from '@nestjs/common';
import { Event } from './entities/event.entity';
import { EventService } from './event.service';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post('add')
    async create(@Body('user_id') userId: number, @Body('ip') ip: string, @Req() request: Request): Promise<Event> {
        return await this.eventService.createEvent(userId, ip);
    }

    @Get('user/:userId')
    async getEvent(@Param('userId') userId: number): Promise<Event | null> {
        return await this.eventService.getEventByUserId(userId);
    }
    
    @Post('update')
    async update(
        @Body('user_id') userId: number,
        @Body('telegram') telegram: string,
        @Body('photo') photo: string, 
        @Body('refs') refs: number
    ): Promise<Event> {
        return await this.eventService.updateEvent(userId, telegram, photo, refs);
    }
    

    @Post('prizes')
    async getAllPrizes(): Promise<string[]> {
        return await this.eventService.getAllPrizes();
    }
    

}