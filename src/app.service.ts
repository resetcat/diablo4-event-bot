import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DiscordService } from './bots/discord.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BossDto, HelltideDto, LegionDto } from './models/events.dto';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private discordService: DiscordService,
    private httpService: HttpService,
  ) {
    // setTimeout(() => {
    //   discordService.sendMessage('interval test');
    // }, 10000);
    this.getRecentEvents();
  }

  async getRecentEvents() {
    try {
      const events = await firstValueFrom(
        this.httpService.get('https://d4armory.io/api/events/recent'),
      );
      const sanitizedData = this.sanitizeData(events.data);
      console.log(sanitizedData);
    } catch (e) {
      this.logger.error(`failed to getRecentEvents() ${e}`);
    }
  }

  sanitizeData(data: any): {
    boss: BossDto;
    helltide: HelltideDto;
    legion: LegionDto;
  } {
    const boss: BossDto = {
      name: data.boss.name,
      timestamp: data.boss.timestamp,
      territory: data.boss.territory,
      zone: data.boss.zone,
    };

    const helltide: HelltideDto = {
      timestamp: data.helltide.timestamp,
      zone: data.helltide.zone,
    };

    const legion: LegionDto = {
      timestamp: data.legion.timestamp,
      territory: data.legion.territory,
      zone: data.legion.zone,
    };

    return { boss, helltide, legion };
  }
}
