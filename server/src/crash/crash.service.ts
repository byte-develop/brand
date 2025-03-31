import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Crash } from './entities/crash.entity';

@Injectable()
export class CrashService {
  constructor(
    @InjectRepository(Crash)
    private crashRepository: Repository<Crash>
  ) {
    this.initializeGame();
  }

  private async initializeGame() {
    let game = await this.crashRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });

    if (!game) {
      const res = this.generateRandomNumber();
      game = new Crash();
      game.UID = uuidv4();
      game.gamePhase = 'betting';
      game.timeLeft = 20;
      game.result = res;
      await this.crashRepository.save(game);
    }

    setInterval(async () => {
      await this.updateGameState();
    }, 1000);
  }

  private async updateGameState() {
    const game = await this.crashRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });

    if (!game) return;

    if (game.gamePhase === 'betting') {
      if (game.timeLeft > 0) {
        game.timeLeft--;
      } else {
        game.gamePhase = 'game';
        game.timeLeft = +game.result; // Make them equal
      }
    } else if (game.gamePhase === 'game') {
      if (game.timeLeft > 0) {
        game.timeLeft--;
      } else {
        const res = this.generateRandomNumber();
        game.gamePhase = 'betting';
        game.timeLeft = 20;
        game.result = res;
      }
    }

    await this.crashRepository.save(game);
  }

  private generateRandomNumber(): number {
    const randomNumber = Math.random();

    if (randomNumber <= 0.3) {
        return 1;
    } else if (randomNumber <= 0.7) {
        return Math.floor(Math.random() * 4) + 2; 
    } else if (randomNumber <= 0.9) { 
        return Math.floor(Math.random() * 5) + 6; 
    } else if (randomNumber <= 0.985) { 
        return Math.floor(Math.random() * 10) + 11;
    } else { 
        return Math.floor(Math.random() * 10) + 21; 
    }
}



  async getGameState() {
    const game = await this.crashRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });

    if (!game) return null;

    return {
      gamePhase: game.gamePhase,
      timeLeft: game.timeLeft,
      UID: game.UID,
      result: game.result
    };
  }


  async getTimeLeft() {
    const game = await this.crashRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });
    return game?.timeLeft;
  }

  async getResult() {
    const game = await this.crashRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });
    return game?.result;
  }
}
