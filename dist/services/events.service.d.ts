import { HttpService } from '@nestjs/axios';
import { BossDto, HelltideDto, LegionDto } from 'src/models/events.dto';
import { Logger } from 'winston';
import { DiscordService } from './discord.service';
export declare class EventsService {
    private readonly logger;
    private httpService;
    private discordService;
    activeEvents: {
        boss: {
            status: boolean;
            data: any;
        };
        legion: {
            status: boolean;
            data: any;
        };
        helltide: {
            status: boolean;
            data: any;
        };
    };
    constructor(logger: Logger, httpService: HttpService, discordService: DiscordService);
    getRecentEvents(): Promise<{
        boss: {
            status: boolean;
            data: BossDto;
        };
        helltide: {
            status: boolean;
            data: HelltideDto;
        };
        legion: {
            status: boolean;
            data: LegionDto;
        };
    }>;
    private isEventStartSoon;
    sanitizeData(data: any): {
        boss: BossDto;
        helltide: HelltideDto;
        legion: LegionDto;
    };
    handleCron(): Promise<void>;
    checkEventChanges(events: any): void;
}
