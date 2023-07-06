export class BossDto {
  name: string;
  timestamp: number;
  territory: string;
  zone: string;
  eventTime: number = 30;
}

export class HelltideDto {
  timestamp: number;
  zone: string;
  eventTime: number = 60;
}

export class LegionDto {
  timestamp: number;
  territory: string;
  zone: string;
  eventTime: number = 5;
}
