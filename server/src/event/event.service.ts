import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { TelegramService2 } from 'src/TelegramBot2';
import { count } from 'console';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
        private readonly telegramService: TelegramService2
    ) { }

    async banByDuplicateIP(ip: string): Promise<void> {
        const eventsWithSameIP = await this.eventRepository.find({ where: { ip: ip } });
    
        if (eventsWithSameIP.length > 0) {
            const updatedEvents = eventsWithSameIP.map(event => {
                event.ban = true;
                return event;
            });
    
            console.log(`Updating ${updatedEvents.length} events to banned status for IP ${ip}.`);
    
            await this.eventRepository.save(updatedEvents);
            console.log(`Banned ${updatedEvents.length} accounts with IP ${ip}.`);
        } else {
            console.log(`No accounts found with IP ${ip}.`);
        }
    }
    
    async createEvent(userId: number, ip: string): Promise<Event | null> {
        const existingEvent = await this.eventRepository.findOne({ where: { user_id: userId } });
    
        if (existingEvent) {
            console.log(`Event for user ID ${userId} already exists.`);
            return null;
        } else {
            const newEvent = this.eventRepository.create({
                user_id: userId,
                telegram: null,
                element: null,
                ip: ip,
                cookie: null,
                my_ref: this.generateRef(),
                join_ref: null,
                succes: false,
                moderation: false,
                ban: false,
                prize: null,
                referrals: 0,
                task_1: false,
                task_2: false,
                task_3: false,
                task_4: false,
            });
    
            const savedEvent = await this.eventRepository.save(newEvent);
            
            const eventsWithSameIP = await this.eventRepository.find({ where: { ip } });
            if (eventsWithSameIP.length > 1) { 
                await this.banByDuplicateIP(ip);
            }
    
            return savedEvent;
        }
    }
    
    


    private generateRef(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    async updateEvent(userId: number, telegram: string, photo: string, refs: number): Promise<Event> {

        const event = await this.eventRepository.findOne({ where: { user_id: userId } });

        if (!event) {
            throw new NotFoundException(`Event not found for user ID ${userId}`);
        }

        event.telegram = telegram;
        event.moderation = true;

        const event_data = {
            userId: userId,
            telegram: telegram,
            photo: photo,
            refs: refs
        }

        await this.telegramService.sendTelegramMessage(event_data);

        return await this.eventRepository.save(event);
    }


    async getEventByUserId(userId: number): Promise<Event | null> {
        return await this.eventRepository.findOne({ where: { user_id: userId } });
    }

    async getAllPrizes(): Promise<string[]> {
        const events = await this.eventRepository.find();
        return events
            .map(event => event.prize)
            .filter(prize => prize !== null);
    }

}
