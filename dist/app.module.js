"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const nest_winston_1 = require("nest-winston");
const winston = require("winston");
const config_1 = require("@nestjs/config");
const discord_service_1 = require("./services/discord.service");
const axios_1 = require("@nestjs/axios");
const events_service_1 = require("./services/events.service");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            nest_winston_1.WinstonModule.forRoot({
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nest_winston_1.utilities.format.nestLike('diablo4-bot', {
                            prettyPrint: true,
                        })),
                    }),
                    new winston.transports.File({
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                        filename: 'logs/errors/error.log',
                        level: 'error',
                        handleExceptions: true,
                        maxsize: 2097152,
                        maxFiles: 3,
                    }),
                    new winston.transports.File({
                        format: winston.format.combine(winston.format.timestamp(), winston.format.json(), winston.format.colorize()),
                        filename: `logs/combined/combined.log`,
                        level: 'info',
                        maxsize: 2097152,
                        maxFiles: 3,
                        handleExceptions: true,
                    }),
                ],
            }),
            config_1.ConfigModule.forRoot({
                envFilePath: '.env',
            }),
            axios_1.HttpModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, discord_service_1.DiscordService, events_service_1.EventsService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map