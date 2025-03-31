import * as TelegramBot from 'node-telegram-bot-api'; 
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './feedback/entities/feedback.entity';

@Injectable()
export class TelegramService {
    private bot: TelegramBot;

    constructor(
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>,
    ) {
        const token = '7957431681:AAEaCh13IA0f3_j_hNBfOmbdCEqGuF4kiTA'; 
        this.bot = new TelegramBot(token, { polling: true });

        this.bot.on('callback_query', async (callbackQuery) => {
            const chatId = callbackQuery.message.chat.id;
            const data = callbackQuery.data;

            if (data.startsWith('approve_')) {
                const feedbackId = Number(data.split('_')[1]);
                await this.approveFeedback(feedbackId);
                await this.bot.sendMessage(chatId, 'Отзыв одобрен!');

                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Скрыть", callback_data: `hide_${feedbackId}` }
                            ]
                        ]
                    }
                };

                await this.bot.editMessageReplyMarkup(options.reply_markup, { chat_id: chatId, message_id: callbackQuery.message.message_id });
            }

            if (data.startsWith('hide_')) {
                const feedbackId = Number(data.split('_')[1]);
                await this.hideFeedback(feedbackId);
                await this.bot.sendMessage(chatId, 'Отзыв скрыт!');

                const options = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "Одобрить", callback_data: `approve_${feedbackId}` }
                            ]
                        ]
                    }
                };

                await this.bot.editMessageReplyMarkup(options.reply_markup, { chat_id: chatId, message_id: callbackQuery.message.message_id });
            }
        });
    }

    async sendTelegramMessage(feedbackData) {
        const chatId = '-1002283934697'; 
        const message = `
          Новый отзыв от ${feedbackData.login}:
          Оценка: ${feedbackData.quantity}
          Текст: ${feedbackData.text}
        `;
        
        const options = {
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: "Одобрить", callback_data: `approve_${feedbackData.id}` },
                        { text: "Скрыть", callback_data: `hide_${feedbackData.id}` }
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

    async approveFeedback(id: number) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (feedback) {
            feedback.hide = false; 
            await this.feedbackRepository.save(feedback);
        }
    }

    async hideFeedback(id: number) {
        const feedback = await this.feedbackRepository.findOne({ where: { id } });
        if (feedback) {
            feedback.hide = true; 
            await this.feedbackRepository.save(feedback);
        }
    }
}