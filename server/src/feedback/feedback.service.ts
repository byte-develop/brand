import { Injectable } from '@nestjs/common';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { Repository } from 'typeorm';
import { TelegramService } from 'src/telegramBot';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private readonly telegramService: TelegramService
  ) { }

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create({ ...createFeedbackDto, hide: true });
    const savedFeedback = await this.feedbackRepository.save(feedback);

    await this.telegramService.sendTelegramMessage(savedFeedback);

    return savedFeedback;
  }

  async findAll({ id_shop }): Promise<Feedback[]> {
    const query = this.feedbackRepository.createQueryBuilder('feedback');

    if (id_shop) {
      query.andWhere('feedback.id_shop = :id_shop', { id_shop });
    }

    query.orderBy('feedback.date', 'DESC');

    return await query.getMany();
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
