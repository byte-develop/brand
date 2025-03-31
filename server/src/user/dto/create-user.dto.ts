import { IsEmail, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {

    login: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @MinLength(6, {message: 'Пароль должен содержать не менее 6 символов!'})
    password: string;
    
    @IsOptional()
    ref: string
}
