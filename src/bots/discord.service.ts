import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Message, NewsChannel, TextChannel } from 'discord.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class DiscordService implements OnModuleInit {
  private client: Client;
  private channelId = '1124356972247011360'; // replace with your channel ID

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

      const channel = this.client.channels.cache.get(this.channelId) as
        | TextChannel
        | NewsChannel;
      if (channel) {
        channel.send({ content: 'This is a message' });
      } else {
        this.logger.log('info', `No such channel: ${this.channelId}`);
      }
    });

    this.client.on('messageCreate', (msg: Message) => {
      this.logger.log('info', `Received message: ${msg.content}`);
      if (msg.content === '!ping') {
        msg.reply('pong');
      }
    });
    // const channel = this.client.channels.cache.get(this.channelId) as
    //   | TextChannel
    //   | NewsChannel;
    // channel.send({ content: 'This is a message' });

    // this.client.channels
    //   .fetch(this.channelId)
    //   .then((channel) => channel.send('booyah!'));

    await this.client.login(process.env.DISCORD_TOKEN);
  }

  // scheduleMessage() {
  //   setInterval(() => {
  //     const randomNum = Math.floor(Math.random() * 100);
  //     const channel = this.client.channels.cache.get(this.channelId);
  //     if (channel.isText()) {
  //       channel.send(`Random number: ${randomNum}`);
  //     }
  //   }, 5000); // sends a message every 5 seconds
  // }
}
