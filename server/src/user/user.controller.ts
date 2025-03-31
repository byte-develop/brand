import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Forms } from 'src/shops/entities/shop.entity';
import { BonusResponse } from './entities/user.entity';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('email')
  @UsePipes(new ValidationPipe())
  async updateEmail(@Body() updateEmailDto: { id: number; newEmail: string }) {
    return this.userService.updateEmail(updateEmailDto.id, updateEmailDto.newEmail);
  }

  @Patch('photo')
  async updatePhoto(@Body() updatePhotoDto: { id: number; photo: string }) {
    return this.userService.updatePhoto(updatePhotoDto.id, updatePhotoDto.photo);
  }

  @Get(':id/photo')
  async getUserPhoto(@Param('id') id: number) {
    return this.userService.getUserPhotoById(id);
  }

  @Post('favourite/add')
  async addToFavourite(@Body() { userId, shopId }: { userId: number; shopId: number }) {
    return this.userService.addToFavourite(userId, shopId);
  }

  @Post('favourite/remove')
  async removeFromFavourite(@Body() { userId, shopId }: { userId: number; shopId: number }) {
    return this.userService.removeFromFavourite(userId, shopId);
  }

  @Get(':id/favourites')
  async getFavouriteShops(@Param('id') id: number): Promise<Forms[]> {
    return this.userService.getFavouriteShops(id);
  }

  @Post('bonus')
  async claimBonus(@Body() body: { userId: number }): Promise<string | BonusResponse> {
    return this.userService.claimBonus(body.userId);
  }

  @Post('bonus_num')
  async bonus(@Body() body: { userId: number }) {
    return this.userService.bonus(body.userId);
  }

  @Post('ref')
  async getCountByRef(@Body() body: { ref: string }): Promise<{ count: number }> {
      const count = await this.userService.countByRef(body.ref);
      return { count };
  }
  
  @Post('balance')
  async setBalance(@Body() body: { userId: number, balance: number }) {
    return this.userService.setBalance(body.userId, body.balance);
  }
  
}