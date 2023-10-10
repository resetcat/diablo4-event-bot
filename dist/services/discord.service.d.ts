import { OnModuleInit } from '@nestjs/common';
import { ButtonInteraction, Client, Message } from 'discord.js';
import { Logger } from 'winston';
export declare class DiscordService implements OnModuleInit {
    private readonly logger;
    private client;
    private channelId;
    private toggleState;
    private button;
    constructor(logger: Logger);
    onModuleInit(): Promise<void>;
    createClient(): Client;
    registerEventListeners(): void;
    loginBot(): Promise<void>;
    reconnectBot(): Promise<void>;
    getToggleStateMessage(): string;
    handleMessageCreate(msg: Message): Promise<void>;
    handleInteractionCreate(interaction: ButtonInteraction): Promise<void>;
    sendEventsMessage(event: any): void;
    calcRemainingEventTime(event: any): number;
    enableTracking(): void;
    disableTracking(): void;
    get isToggleState(): boolean;
}
