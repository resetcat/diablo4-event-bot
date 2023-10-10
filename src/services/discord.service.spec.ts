import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { DiscordService } from './discord.service';

describe('DiscordService', () => {
  let service: DiscordService;
  let logger: jest.Mocked<any>;

  beforeEach(async () => {
    logger = {
      info: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscordService,
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: logger,
        },
      ],
    }).compile();

    service = module.get<DiscordService>(DiscordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call onModuleInit', () => {
    const onModuleInitSpy = jest.spyOn(service, 'onModuleInit');
    service.onModuleInit();
    expect(onModuleInitSpy).toHaveBeenCalled();
  });
  // Example test for calcRemainingEventTime method
  it('should calculate remaining event time for helltide event', () => {
    const event = {
      data: {
        type: 'helltide',
        timestamp: Date.now(),
        eventTime: 5, // in minutes
      },
    };
    const result = service.calcRemainingEventTime(event);
    expect(result).toBeGreaterThanOrEqual(0);
  });
});
