export class BossDto {
  type: string = 'boss';
  name: string;
  timestamp: number;
  territory: string;
  zone: string;
  eventTime: number = 30;
}

export class HelltideDto {
  type: string = 'helltide';
  timestamp: number;
  zone: string;
  eventTime: number = 60;
}

export class LegionDto {
  type: string = 'legion';
  timestamp: number;
  territory: string;
  zone: string;
  eventTime: number = 5;
}
