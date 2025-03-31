import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ShopsModule } from 'src/shops/shops.module';
import { TransfersService } from 'src/transfers/transfers.service';
import { Transfers } from 'src/transfers/entities/transfers.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Transfers]),
    ShopsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '30d' }
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [UserController],
  providers: [UserService, TransfersService],
  exports: [UserService, TransfersService]
})
export class UserModule {}