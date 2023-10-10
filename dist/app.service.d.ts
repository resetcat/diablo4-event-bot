import { Logger } from 'winston';
import { DiscordService } from './services/discord.service';
import { HttpService } from '@nestjs/axios';
export declare class AppService {
    private readonly logger;
    private discordService;
    private httpService;
    constructor(logger: Logger, discordService: DiscordService, httpService: HttpService);
}
