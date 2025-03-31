import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BonusResponse } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from "argon2";
import { emit } from 'process';
import { JwtService } from '@nestjs/jwt';
import { Forms } from 'src/shops/entities/shop.entity';
import { TransfersService } from 'src/transfers/transfers.service';
import { CreateTransfersDto } from 'src/transfers/dto/create-transfers.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Forms) private readonly shopRepository: Repository<Forms>,
    private transfersService: TransfersService,
    private readonly jwtService: JwtService
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existLogin = await this.userRepository.findOne({
      where: {
        login: createUserDto.login,
      }
    });
    if (existLogin) throw new BadRequestException('Этот логин занят.');

    if (createUserDto.email) {
      const existEmail = await this.userRepository.findOne({
        where: {
          email: createUserDto.email,
        }
      });
      if (existEmail) throw new BadRequestException('Этот email занят.');
    }

    const user = await this.userRepository.save({
      login: createUserDto.login,
      email: createUserDto.email || null,
      password: await argon2.hash(createUserDto.password),
      ref: createUserDto.ref || null,
    });

    const token = this.jwtService.sign({ login: createUserDto.login });

    return { user, token };
  }

  async findOne(login: string) {
    return await this.userRepository.findOne({
      where: {
        login,
      }
    })
  }

  async updateEmail(id: number, newEmail: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден.');

    const existEmail = await this.userRepository.findOne({
      where: { email: newEmail },
    });
    if (existEmail) throw new BadRequestException('Этот email занят.');

    user.email = newEmail;
    await this.userRepository.save(user);

    const token = this.jwtService.sign({ login: user.login, id: user.id, email: newEmail });
    return { user, token };
  }

  async updatePhoto(id: number, photo: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден.');

    user.photo = photo;
    await this.userRepository.save(user);

    const token = this.jwtService.sign({ login: user.login, id: user.id, email: user.email });
    return { user, token };
  }

  async getUserPhotoById(id: number): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('Пользователь не найден.');

    return user.photo;
  }

  async update(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findOneByID(id: number): Promise<User | undefined> {
    console.log(`Finding user by ID: ${id}`);
    return await this.userRepository.findOne({ where: { id } });
  }

  async addToFavourite(userId: number, shopId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден.');

    const favourites = user.favourite ? user.favourite.split(',').map(id => id.trim()) : [];

    if (!favourites.includes(shopId.toString())) {
      favourites.push(shopId.toString());
      user.favourite = favourites.join(', ');
      await this.userRepository.save(user);
    }

    return user;
  }

  async removeFromFavourite(userId: number, shopId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден.');

    const favourites = user.favourite ? user.favourite.split(',').map(id => id.trim()) : [];

    const filteredFavourites = favourites.filter(id => id !== shopId.toString());

    user.favourite = filteredFavourites.join(', ');
    await this.userRepository.save(user);

    return user;
  }

  async getFavouriteShops(userId: number): Promise<Forms[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден.');

    const favouriteIds = user.favourite ? user.favourite.split(',').map(id => id.trim()) : [];
    const shops = await this.shopRepository.findByIds(favouriteIds);
    return shops;
  }

  async claimBonus(userId: number): Promise<string | BonusResponse> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const now = new Date();
    const timeSinceLastClaim = now.getTime() - (user.last_bonus_claimed ? user.last_bonus_claimed.getTime() : 0);

    if ((24 * 60 * 60 * 1000 - timeSinceLastClaim) <= 0) {
      let bonusAmount = 0;
      let bonusMessage = "";

      switch (user.bonus_count) {
        case 0:
          bonusAmount = 15;
          bonusMessage = "Вы получили первый бонус!";
          break;
        case 1:
          bonusAmount = 25;
          bonusMessage = "Вы получили второй бонус!";
          break;
        case 2:
          bonusAmount = 50;
          bonusMessage = "Вы получили третий бонус!";
          break;
        case 3:
          bonusAmount = 75;
          bonusMessage = "Вы получили четвертый бонус!";
          break;
        case 4:
          bonusAmount = 100;
          bonusMessage = "Вы получили пятый бонус!";
          break;
        case 5:
          bonusAmount = 120;
          bonusMessage = "Вы получили шестой бонус!";
          break;
        case 6:
          bonusAmount = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
          bonusMessage = "Вы получили седьмой бонус!";
          user.bonus_count = -1;
          break;
        default:
          return "Ошибка: Максимальное количество бонусов достигнуто.";
      }

      user.balance = user.balance + bonusAmount;
      user.bonus_count++;
      user.is_bonus_active = true;
      user.last_bonus_claimed = now;

      const createTransfersDto: CreateTransfersDto = {
        id_user: userId,
        price: `+${bonusAmount}`,
        date: now,
        key: 'Ежедневный бонус',
      };

      await this.transfersService.create(createTransfersDto);

      await this.userRepository.save(user);
      return bonusMessage;
    } else {
      const timeRemaining = (24 * 60 * 60 * 1000) - timeSinceLastClaim;

      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      const formattedTimeRemaining = `${hours}ч ${minutes}м ${seconds}с`;

      return (`Осталось времени до следующего запроса бонуса: ${formattedTimeRemaining}`);
    }
  }

  async bonus(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("Пользователь не найден");
    }

    const now = new Date();
    const timeSinceLastClaim = now.getTime() - (user.last_bonus_claimed ? user.last_bonus_claimed.getTime() : 0);
    const bonus_num = user.bonus_count;
    const timeRemaining = 24 * 60 * 60 * 1000 - timeSinceLastClaim;

    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    const formattedTimeRemaining = `${hours}ч ${minutes}м ${seconds}с`;

    if ((user.last_bonus_claimed ? user.last_bonus_claimed.getTime() : 0) > now.getTime()) {
      return ("Ошибка: Время последнего запроса бонуса больше текущего времени.");
    }

    if ((24 * 60 * 60 * 1000 - timeSinceLastClaim) <= 0) {
      if ((48 * 60 * 60 * 1000 - timeSinceLastClaim) <= 0) {
        user.bonus_count = 0;
        await this.userRepository.save(user);

        return {
          bonus_num: 0,
          timeRemaining: 0
        };
      } else {
        return {
          bonus_num: bonus_num,
          timeRemaining: 0
        };
      }
    } else {
      return {
        bonus_num: bonus_num,
        timeRemaining: formattedTimeRemaining
      };
    }
  }

  async countByRef(ref: string): Promise<number> {
    return await this.userRepository.count({ where: { ref } });
  }

  async setBalance(userId: number, balance: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Пользователь не найден.');

    user.balance = balance;
    await this.userRepository.save(user);
  }
}
