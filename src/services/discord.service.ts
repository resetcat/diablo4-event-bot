import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
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
  }

  async loginBot() {
    await this.client.login(process.env.DISCORD_TOKEN);
  }

  async handleMessageCreate(msg: Message) {
    this.logger.log('info', `Received message: ${msg.content}`);
    if (msg.content === '!button') {
      const row: any = new ActionRowBuilder().addComponents(this.button);

      msg.reply({
        content: `@here Event tracking: ${this.toggleState ? 'On' : 'Off'}`,
        components: [row],
      });
    }
  }

  async handleInteractionCreate(interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'toggleButton') {
      // Toggle the state
      this.toggleState = !this.toggleState;

      // Trigger the function based on the new state
      if (this.toggleState) {
        this.onFunction();
      } else {
        this.offFunction();
      }

      const row: any = new ActionRowBuilder().addComponents(this.button);

      // Update the message
      await interaction.update({
        content: `@here Event tracking: ${this.toggleState ? 'On' : 'Off'}`,
        components: [row],
      });
    }
  }

  onFunction() {
    // Code that should be executed when the function is turned on
    this.logger.log('info', 'The function has been toggled on.');
  }

  offFunction() {
    // Code that should be executed when the function is turned off
    this.logger.log('info', 'The function has been toggled off.');
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
