import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransfersDto {
  @IsNotEmpty()
  @IsNumber()
  id_user: number;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  key: string;
}