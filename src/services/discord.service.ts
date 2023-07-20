import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
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
  private toggleState = false;
  private button = new ButtonBuilder()
    .setCustomId('toggleButton')
    .setLabel('Click to toggle')
    .setStyle(ButtonStyle.Primary);

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
    this.client.on(
      'interactionCreate',
      this.handleInteractionCreate.bind(this),
    );
    // 'disconnect' event listener
    this.client.on('disconnect', () => {
      this.logger.log(
        'info',
        `Bot has disconnected. Attempting to reconnect...`,
      );
      this.reconnectBot();
    });
  }

  async loginBot() {
    await this.client.login(process.env.DISCORD_TOKEN);
  }

  async reconnectBot() {
    try {
      // Try to login again
      await this.client.login(process.env.DISCORD_TOKEN);
      this.logger.log('info', `Reconnected successfully!`);
    } catch (error) {
      this.logger.log('error', `Failed to reconnect: ${error}`);
      // Wait for 30 seconds before attempting to reconnect again
      setTimeout(() => this.reconnectBot(), 30000);
    }
  }

  getToggleStateMessage() {
    return `Event tracking: ${this.toggleState ? '**✅ On**' : '**❌ Off**'}`;
  }

  async handleMessageCreate(msg: Message) {
    this.logger.log('info', `Received message: ${msg.content}`);
    if (msg.content === '!button') {
      const row: any = new ActionRowBuilder().addComponents(this.button);

      msg.reply({
        content: `@here ${this.getToggleStateMessage()}`,
        components: [row],
      });
    }
  }

  async handleInteractionCreate(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'toggleButton') {
      // Toggle the state
      this.toggleState = !this.toggleState;
      const message = this.getToggleStateMessage();
      this.logger.info(message);

      const row: any = new ActionRowBuilder().addComponents(this.button);

      // Update the message
      await interaction.update({
        content: `@here ${message}`,
        components: [row],
      });
    }
  }

  sendEventsMessage(event: any) {
    const channel = this.client.channels.cache.get(this.channelId) as
      | TextChannel
      | NewsChannel;
    const eventName = event.data.type;
    const remainingEventTime = this.calcRemainingEventTime(event);
    const isHelltide = eventName === 'helltide';
    const eventTimestamp = Math.floor((Date.now() + remainingEventTime) / 1000);

    let content = `@here `;
    if (event.data.name) {
      content += `${event.data.name} `;
    }
    content += `${
      eventName.charAt(0).toUpperCase() + eventName.slice(1)
    } event will ${isHelltide ? 'end' : 'start'} in zone: ${
      event.data.zone
    } <t:${eventTimestamp}:R>`;

    if (channel) {
      channel.send({ content: content }).then((msg) => {
        setTimeout(() => {
          msg
            .delete()
            .catch((e) => this.logger.error(`Failed to delete message: ${e}`));
        }, remainingEventTime);
      });
    } else {
      this.logger.log('info', `No such channel: ${this.channelId}`);
    }
  }

  calcRemainingEventTime(event: any): number {
    const now = Date.now();
    let remainingEventTime: number;

    if (event.data.type === 'helltide') {
      remainingEventTime = Math.max(
        0,
        event.data.timestamp + event.data.eventTime * 60 * 1000 - now,
      );
    } else {
      remainingEventTime = Math.max(0, event.data.timestamp - now);
    }

    return remainingEventTime;
  }

  // Set to true at 10:00
  @Cron('0 10 * * *')
  enableTracking() {
    this.toggleState = true;
    this.logger.info('Event tracking: On');
  }

  // Set to false at 22:00
  @Cron('0 22 * * *')
  disableTracking() {
    this.toggleState = false;
    this.logger.info('Event tracking: Off');
  }

  get isToggleState(): boolean {
    return this.toggleState;
  }
}
