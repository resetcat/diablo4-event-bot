import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import * as winston from 'winston';
import { ConfigModule } from '@nestjs/config';
import { DiscordService } from './services/discord.service';
import { HttpModule } from '@nestjs/axios';
import { EventsService } from './services/events.service';
@Module({
  imports: [
    WinstonModule.forRoot({
      // options
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('diablo4-bot', {
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          filename: 'logs/errors/error.log',
          level: 'error',
          handleExceptions: true,
          maxsize: 2097152,
          maxFiles: 3,
        }),
        new winston.transports.File({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.colorize(),
          ),
          filename: `logs/combined/combined.log`,
          level: 'info',
          maxsize: 2097152,
          maxFiles: 3,
          handleExceptions: true,
        }),
      ],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    HttpModule,
  ],
  controllers: [AppController],
  providers: [AppService, DiscordService, EventsService],
})
export class AppModule {}
