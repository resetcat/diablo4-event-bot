import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { type } from 'os';
import { firstValueFrom } from 'rxjs';
import { BossDto, HelltideDto, LegionDto } from 'src/models/events.dto';
import { Logger } from 'winston';

@Injectable()
export class EventsService {
  activeEvents = {
    boss: { status: false, data: null },
    legion: { status: false, data: null },
    helltide: { status: false, data: null },
  };
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private httpService: HttpService,
  ) {
    // setTimeout(() => {
    //   this.handleCron();
    // }, 200);
  }

  async getRecentEvents() {
    try {
      const events = await firstValueFrom(
        this.httpService.get('https://d4armory.io/api/events/recent'),
      );
      const sanitizedData = this.sanitizeData(events.data);

      return {
        boss: {
          status: this.isEventStartSoon(sanitizedData.boss),
          data: sanitizedData.boss,
        },
        helltide: {
          status: this.isEventStartSoon(sanitizedData.helltide),
          data: sanitizedData.helltide,
        },
        legion: {
          status: this.isEventStartSoon(sanitizedData.legion),
          data: sanitizedData.legion,
        },
      };
    } catch (e) {
      this.logger.error(`failed to getRecentEvents() ${e}`);
    }
  }

  private isEventStartSoon(dto: {
    type: string;
    timestamp: number;
    eventTime: number;
  }): boolean {
    const now = Date.now();
    const oneMinuteAhead = now + 1 * 60 * 1000;
    const eventTime = dto.timestamp;
    const eventStartBuffer = eventTime - dto.eventTime * 60 * 1000;
    const eventEndBuffer = eventTime + dto.eventTime * 60 * 1000;

    if (dto.type === 'boss' || dto.type === 'legion') {
      return oneMinuteAhead >= eventStartBuffer && now <= eventTime;
    } else if (dto.type === 'helltide') {
      return oneMinuteAhead <= eventEndBuffer;
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

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.info('running chronEvent chronjob()');
    const events = await this.getRecentEvents();
    this.checkEventChanges(events);
  }

  checkEventChanges(events: any) {
    for (const event in events) {
      if (
        events[event].status !== this.activeEvents[event].status &&
        events[event].status === true
      ) {
        this.logger.info(
          `${events[event].data.type} events has started! Event time: ${events[event].data.eventTime} minutes`,
        );
        // TODO: send to discrod
      }
      this.activeEvents[event] = events[event]
        ? events[event]
        : this.activeEvents[event];
      this.logger.warn(
        `Event: ${event}, Status: ${this.activeEvents[event].status}`,
      );
    }
  }
}
