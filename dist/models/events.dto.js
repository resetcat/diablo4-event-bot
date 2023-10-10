"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegionDto = exports.HelltideDto = exports.BossDto = void 0;
class BossDto {
    constructor() {
        this.type = 'boss';
        this.eventTime = 30;
    }
}
exports.BossDto = BossDto;
class HelltideDto {
    constructor() {
        this.type = 'helltide';
        this.eventTime = 60;
    }
}
exports.HelltideDto = HelltideDto;
class LegionDto {
    constructor() {
        this.type = 'legion';
        this.eventTime = 5;
    }
}
exports.LegionDto = LegionDto;
//# sourceMappingURL=events.dto.js.map