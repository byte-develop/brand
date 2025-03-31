import * as TelegramBot from 'node-telegram-bot-api'; 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './event/entities/event.entity';

@Injectable()
export class TelegramService2 {
    private bot: TelegramBot;

    constructor(
        @InjectRepository(Event)
        private eventRepository: Repository<Event>,
    ) {
        const token = '7670113994:AAFCK_rka0aCJNQXAYZ24RuVR8oPNO-_1Ew'; 
        this.bot = new TelegramBot(token, { polling: true });
        this.bot.on('callback_query', async (callbackQuery) => {
            const chatId = callbackQuery.message.chat.id;
            const data = callbackQuery.data;

            if (data.startsWith('approve_')) {
                const userId = Number(data.split('_')[1]);
                await this.approveEvent(userId);
                await this.bot.sendMessage(chatId, 'Модерация одобрена!');

                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Отклонить", callback_data: `hide_${userId}` }
                            ]
                        ]
                    }
                };

                await this.bot.editMessageReplyMarkup(options.reply_markup, { chat_id: chatId, message_id: callbackQuery.message.message_id });
            }

            if (data.startsWith('hide_')) {
                const userId = Number(data.split('_')[1]);
                await this.hideEvent(userId);
                await this.bot.sendMessage(chatId, 'Модерация отклонена!');

                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Одобрить", callback_data: `approve_${userId}` }
                            ]
                        ]
                    }
                };

                await this.bot.editMessageReplyMarkup(options.reply_markup, { chat_id: chatId, message_id: callbackQuery.message.message_id });
            }
        });
    }

    async sendTelegramMessage(EventData) {
        const chatId = '6647563295'; 
        const message = `
            Новая заявка на модерацию
            Telegram: ${EventData.telegram}
            Количество рефералов: ${EventData.refs}
            ${EventData.photo}

        `;
        
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Одобрить", callback_data: `approve_${EventData.userId}` },
                        { text: "Отклонить", callback_data: `hide_${EventData.userId}` }
                    ]
                ]
            }
        };

        try {
            await this.bot.sendMessage(chatId, message, options);
        } catch (error) {
            console.error('Ошибка при отправке сообщения в Telegram:', error);
        }
    }

    async approveEvent(id: number) {
        const event = await this.eventRepository.findOne({ where: { user_id: id } });
        if (event) {
            event.moderation = false; 
            event.succes = true; 
            await this.eventRepository.save(event);
        }
    }

    async hideEvent(id: number) {
        const event = await this.eventRepository.findOne({ where: { user_id: id } });
        if (event) {
            event.moderation = false; 
            await this.eventRepository.save(event);
        }
    }
}