import { IsEmail } from 'class-validator';

export class UpdateEmailDto {
    id: number;

    @IsEmail()
    newEmail: string;
}