import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { DiscordService } from './bots/discord.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
    private discordService: DiscordService,
  ) {
    setTimeout(() => {
      discordService.sendMessage('interval test');
    }, 10000);
  }

  getHello(): string {
    this.logger.info('gethello started');
    return 'Hello World!';
  }
}
