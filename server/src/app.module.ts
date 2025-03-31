import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ShopsModule } from './shops/shops.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WorksModule } from './works/works.module';
import { PromocodekModule } from './promocodes/promocodes.module';
import { HomeModule } from './home/home.module';
import { AdminsModule } from './admins/admins.module';
import { EventModule } from './event/event.module';
import { SalesModule } from './sales/sales.module';
import { AdsModule } from './ads/ads.module';
import { TransfersModule } from './transfers/transfers.module';
import { RouletteModule } from './roulette/roulette.module';
import { BetsModule } from './bets/bets.module';
import { Crash } from './miner/entities/crash.entity';
import { CrashModule } from './crash/crash.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        logging: true,
        synchronize: true,
        entities: [__dirname + '/**/*.entity{.js, .ts}']
      }),
      inject: [ConfigService]
    }),
    AuthModule,
    ShopsModule,
    FeedbackModule,
    WorksModule,
    PromocodekModule,
    HomeModule,
    AdminsModule,
    EventModule,
    SalesModule,
    AdsModule,
    TransfersModule,
    RouletteModule,
    BetsModule,
    CrashModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
