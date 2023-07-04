import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  Message,
  NewsChannel,
  TextChannel,
} from 'discord.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private channelId = process.env.DISCORD_CHANNEL_ID; // replace with your channel ID

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.logger.info('starting DiscordService');
  }

  async onModuleInit() {
    this.client = this.createClient();
    this.registerEventListeners();
    await this.loginBot();
  }

  createClient(): Client {
    return new Client({
      intents: [
        'Guilds',
        'GuildMessages',
        'DirectMessages',
        'GuildMessageReactions',
        'GuildMessageTyping',
        'MessageContent',
      ],
    });
  }

  registerEventListeners() {
    this.client.once('ready', () => {
      this.logger.log('info', `Bot is ready as: ${this.client.user.tag}`);
    });

    this.client.on('messageCreate', this.handleMessageCreate.bind(this));
  }

  async loginBot() {
    await this.client.login(process.env.DISCORD_TOKEN);
  }

  async handleMessageCreate(msg: Message) {
    this.logger.log('info', `Received message: ${msg.content}`);
    if (msg.content === '!ping') {
      const row: any = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('confirm')
          .setLabel('Confirm Ban')
          .setStyle(ButtonStyle.Danger),
        new ButtonBuilder()
          .setCustomId('cancel')
          .setLabel('Cancel')
          .setStyle(ButtonStyle.Secondary),
      );
      await msg.reply({
        content: 'ping',
        components: [row],
      });
    }
  }

  sendMessage(content: string) {
    const channel = this.client.channels.cache.get(this.channelId) as
      | TextChannel
      | NewsChannel;
    if (channel) {
      channel.send({ content: content });
    } else {
      this.logger.log('info', `No such channel: ${this.channelId}`);
    }
  }
}
