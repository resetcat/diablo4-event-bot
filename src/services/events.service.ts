import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Observable, firstValueFrom } from 'rxjs';
import { BossDto, HelltideDto, LegionDto } from 'src/models/events.dto';
import { Logger } from 'winston';

@Injectable()
export class EventsService {
  activeEvents = {
    boss: false,
    legion: false,
    hellTide: false,
  };
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private httpService: HttpService,
  ) {
    this.getRecentEvents();
  }

  async getRecentEvents() {
    try {
      const events = await firstValueFrom(
        this.httpService.get('https://d4armory.io/api/events/recent'),
      );
      const sanitizedData = this.sanitizeData(events.data);
      console.log(sanitizedData);
      return sanitizedData;
    } catch (e) {
      this.logger.error(`failed to getRecentEvents() ${e}`);
    }
  }

  sanitizeData(data: any): {
    boss: BossDto;
    helltide: HelltideDto;
    legion: LegionDto;
  } {
    const boss = new BossDto();
    boss.name = data.boss.name;
    boss.timestamp = data.boss.timestamp * 1000;
    boss.territory = data.boss.territory;
    boss.zone = data.boss.zone;

    const helltide = new HelltideDto();
    helltide.timestamp = data.helltide.timestamp * 1000;
    helltide.zone = data.helltide.zone;

    const legion = new LegionDto();
    legion.timestamp = data.legion.timestamp * 1000;
    legion.territory = data.legion.territory;
    legion.zone = data.legion.zone;

    return { boss, helltide, legion };
  }
}
