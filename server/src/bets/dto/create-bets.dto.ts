import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBetseDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number; 

    @IsNotEmpty()
    @IsNumber()
    betAmount: number;

    @IsNotEmpty()
    @IsString()
    betResult: string;

    @IsNotEmpty()
    @IsDate()
    betTime: Date;

    @IsNotEmpty()
    @IsString()
    UID: string;
}