import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roulette } from './entities/roulette.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RouletteService {
  constructor(
    @InjectRepository(Roulette)
    private rouletteRepository: Repository<Roulette>
  ) {
    this.initializeGame();
  }

  private readonly colors = [
    {
      color: "blue",
      probability: 1 / 130,
      rotate: 0,
    },
    {
      color: "red", 
      probability: 1 / 50,
      rotate: -9
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -19
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -28
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -38
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -47
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -57
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -67
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -76
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -87
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -96
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -106
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -116
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -126
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -136
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -145
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -155
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -165
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -175
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -184
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -190
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -204
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -214
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -224
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -233
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -243
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -253
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -263
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -272
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -282
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -292
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -301
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -311
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -321
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -331
    },
    {
      color: "red",
      probability: 1 / 50,
      rotate: -340
    },
    {
      color: "black",
      probability: 1 / 50,
      rotate: -350
    },
  ];

  private async initializeGame() {
    let game = await this.rouletteRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });

    if (!game) {
      game = new Roulette();
      game.UID = uuidv4();
      game.gamePhase = 'betting';
      game.timeLeft = 20;
      game.result = '';
      game.rotate = 0;
      await this.rouletteRepository.save(game);
    }

    setInterval(async () => {
      await this.updateGameState();
    }, 1000);
}

  private async updateGameState() {
    const game = await this.rouletteRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });

    if (!game) return;

    if (game.gamePhase === 'betting') {
      if (game.timeLeft > 0) {
        game.timeLeft--;
      } else {
        game.gamePhase = 'spinning';
        const result = this.spinRoulette();
        game.result = result.color;
        game.rotate = result.rotate;
        game.timeLeft = 15;
      }
    } else if (game.gamePhase === 'spinning' && game.timeLeft > 0) {
      game.timeLeft--;
      if (game.timeLeft === 0) {
        game.gamePhase = 'pause';
        game.timeLeft = 5;
      }
    } else if (game.gamePhase === 'pause' && game.timeLeft > 0) {
      game.timeLeft--;
      if (game.timeLeft === 0) {
        game.gamePhase = 'betting';
        game.timeLeft = 20;
        game.result = '';
        game.rotate = 0;
        game.UID = uuidv4();
      }
    }

    await this.rouletteRepository.save(game);
  }

  private spinRoulette(): { color: string, rotate: number } {
    // Генерируем случайный индекс массива
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    const selectedColor = this.colors[randomIndex];
    
    return { 
      color: selectedColor.color, 
      rotate: selectedColor.rotate 
    };
  }

  async getGameState() {
    const game = await this.rouletteRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });
    
    if (!game) return null;

    return {
      gamePhase: game.gamePhase,
      timeLeft: game.timeLeft,
      result: game.result,
      rotate: game.rotate,
      UID: game.UID
    };
  }


  async getTimeLeft() {
    const game = await this.rouletteRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });
    return game?.timeLeft;
  }

  async getResult() {
    const game = await this.rouletteRepository.findOne({
      where: {},
      order: { id: 'DESC' }
    });
    return game?.result;
  }
}
