import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UserService, // Удаляем UserRepository
        private readonly jwtService: JwtService,
    ) { }


    async validateUser(login: string, password: string): Promise<any> {
        const user = await this.usersService.findOne(login);
        if (!user) {
            throw new BadRequestException('Логин или пароль неверный!');
        }

        const passwordIsMatch = await argon2.verify(user.password, password)

        if (user && passwordIsMatch) {
            return user
        }

        throw new BadRequestException('Логин или пароль неверный!')
    }

    async login(user: IUser) {
        const { id, login, email } = user

        return {
            id,
            login,
            ...(email ? { email } : {}),
            token: this.jwtService.sign({ id: user.id, login: user.login, ...(email ? { email } : {}) })
        };
    }

    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<any> {
        const user = await this.usersService.findOneByID(id);
        if (!user) throw new NotFoundException('Пользователь не найден.');

        const passwordIsMatch = await argon2.verify(user.password, oldPassword);
        if (!passwordIsMatch) throw new BadRequestException('Старый пароль неверный!');

        user.password = await argon2.hash(newPassword);
        await this.usersService.update(user);

        const token = this.jwtService.sign({ id: user.id, login: user.login, email: user.email });
        return { user, token }; 
    }
}
