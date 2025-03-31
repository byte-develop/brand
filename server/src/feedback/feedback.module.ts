import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Feedback } from './entities/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegramService } from 'src/telegramBot';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback])],
  controllers: [FeedbackController], 
  providers: [FeedbackService, TelegramService],
})
export class FeedbackModule {}
