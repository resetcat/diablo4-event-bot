"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const discord_js_1 = require("discord.js");
const nest_winston_1 = require("nest-winston");
let DiscordService = class DiscordService {
    constructor(logger) {
        this.logger = logger;
        this.channelId = process.env.DISCORD_CHANNEL_ID;
        this.toggleState = false;
        this.button = new discord_js_1.ButtonBuilder()
            .setCustomId('toggleButton')
            .setLabel('Click to toggle')
            .setStyle(discord_js_1.ButtonStyle.Primary);
        this.logger.info('starting DiscordService');
    }
    async onModuleInit() {
        this.client = this.createClient();
        this.registerEventListeners();
        await this.loginBot();
    }
    createClient() {
        return new discord_js_1.Client({
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
        this.client.on('interactionCreate', this.handleInteractionCreate.bind(this));
        this.client.on('disconnect', () => {
            this.logger.log('info', `Bot has disconnected. Attempting to reconnect...`);
            this.reconnectBot();
        });
    }
    async loginBot() {
        await this.client.login(process.env.DISCORD_TOKEN);
    }
    async reconnectBot() {
        try {
            await this.client.login(process.env.DISCORD_TOKEN);
            this.logger.log('info', `Reconnected successfully!`);
        }
        catch (error) {
            this.logger.log('error', `Failed to reconnect: ${error}`);
            setTimeout(() => this.reconnectBot(), 30000);
        }
    }
    getToggleStateMessage() {
        return `Event tracking: ${this.toggleState ? '**✅ On**' : '**❌ Off**'}`;
    }
    async handleMessageCreate(msg) {
        this.logger.log('info', `Received message: ${msg.content}`);
        if (msg.content === '!button') {
            const row = new discord_js_1.ActionRowBuilder().addComponents(this.button);
            msg.reply({
                content: `@here ${this.getToggleStateMessage()}`,
                components: [row],
            });
        }
    }
    async handleInteractionCreate(interaction) {
        if (!interaction.isButton())
            return;
        if (interaction.customId === 'toggleButton') {
            this.toggleState = !this.toggleState;
            const message = this.getToggleStateMessage();
            this.logger.info(message);
            const row = new discord_js_1.ActionRowBuilder().addComponents(this.button);
            await interaction.update({
                content: `@here ${message}`,
                components: [row],
            });
        }
    }
    sendEventsMessage(event) {
        const channel = this.client.channels.cache.get(this.channelId);
        const eventName = event.data.type;
        const remainingEventTime = this.calcRemainingEventTime(event);
        const isHelltide = eventName === 'helltide';
        const eventTimestamp = Math.floor((Date.now() + remainingEventTime) / 1000);
        let content = `@here `;
        if (event.data.name) {
            content += `${event.data.name} `;
        }
        content += `${eventName.charAt(0).toUpperCase() + eventName.slice(1)} event will ${isHelltide ? 'end' : 'start'} in zone: ${event.data.zone} <t:${eventTimestamp}:R>`;
        if (channel) {
            channel.send({ content: content }).then((msg) => {
                setTimeout(() => {
                    msg
                        .delete()
                        .catch((e) => this.logger.error(`Failed to delete message: ${e}`));
                }, remainingEventTime);
            });
        }
        else {
            this.logger.log('info', `No such channel: ${this.channelId}`);
        }
    }
    calcRemainingEventTime(event) {
        const now = Date.now();
        let remainingEventTime;
        if (event.data.type === 'helltide') {
            remainingEventTime = Math.max(0, event.data.timestamp + event.data.eventTime * 60 * 1000 - now);
        }
        else {
            remainingEventTime = Math.max(0, event.data.timestamp - now);
        }
        return remainingEventTime;
    }
    enableTracking() {
        this.toggleState = true;
        this.logger.info('Event tracking: On');
    }
    disableTracking() {
        this.toggleState = false;
        this.logger.info('Event tracking: Off');
    }
    get isToggleState() {
        return this.toggleState;
    }
};
__decorate([
    (0, schedule_1.Cron)('0 10 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscordService.prototype, "enableTracking", null);
__decorate([
    (0, schedule_1.Cron)('0 22 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DiscordService.prototype, "disableTracking", null);
DiscordService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_PROVIDER)),
    __metadata("design:paramtypes", [Object])
], DiscordService);
exports.DiscordService = DiscordService;
//# sourceMappingURL=discord.service.js.map