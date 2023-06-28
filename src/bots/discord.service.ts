import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Message } from 'discord.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    logger.info('starting DiscordService');
  }
  async onModuleInit() {
    this.client = new Client({
      intents: [
        'Guilds',
        'GuildMessages',
        'DirectMessages',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'MessageContent',
      ],
    });

    this.client.on('ready', () => {
      this.logger.log('info', `Bot is ready as: ${this.client.user.tag}`);
    });

    this.client.on('messageCreate', (msg: Message) => {
      this.logger.log('info', `Received message: ${msg.content}`);
      if (msg.content === '!ping') {
        msg.reply('pong');
      }
    });

    await this.client.login(process.env.DISCORD_TOKEN);
  }
}
