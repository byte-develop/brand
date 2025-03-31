import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePhotoDto {
    @IsNotEmpty()
    @IsString()
    userId: number;

    @IsNotEmpty()
    @IsString()
    photoUrl: string;
}