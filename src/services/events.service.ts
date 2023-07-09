import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { firstValueFrom } from 'rxjs';
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
      // console.log(sanitizedData);
      this.checkEvents(sanitizedData);
      return sanitizedData;
    } catch (e) {
      this.logger.error(`failed to getRecentEvents() ${e}`);
    }
  }

  private isEventStartSoon(
    eventType: string,
    dto: {
      timestamp: number;
      eventTime: number;
    },
  ): boolean {
    const now = Date.now();
    const oneMinuteAhead = now + 1 * 60 * 1000;
    const eventTime = dto.timestamp;
    const eventStartBuffer = eventTime - dto.eventTime * 60 * 1000;
    const eventEndBuffer = eventTime + dto.eventTime * 60 * 1000;

    if (eventType === 'boss' || eventType === 'legion') {
      return oneMinuteAhead >= eventStartBuffer && now <= eventTime;
    } else if (eventType === 'helltide') {
      return oneMinuteAhead <= eventEndBuffer;
    }
  }

  public checkEvents(events: {
    boss: BossDto;
    helltide: HelltideDto;
    legion: LegionDto;
  }) {
    const areEventsStartingSoon = {
      boss: this.isEventStartSoon('boss', events.boss),
      helltide: this.isEventStartSoon('helltide', events.helltide),
      legion: this.isEventStartSoon('legion', events.legion),
    };
    this.logger.info(`event status : ${JSON.stringify(areEventsStartingSoon)}`);

    return areEventsStartingSoon;
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
