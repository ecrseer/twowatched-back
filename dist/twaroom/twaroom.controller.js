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
exports.TwaroomController = void 0;
const common_1 = require("@nestjs/common");
const twaroom_service_1 = require("./twaroom.service");
const create_twaroom_dto_1 = require("./dto/create-twaroom.dto");
const twamessage_schema_1 = require("./entities/twamessage.schema");
let TwaroomController = class TwaroomController {
    twaroomService;
    constructor(twaroomService) {
        this.twaroomService = twaroomService;
    }
    create(createTwaroomDto) {
        return this.twaroomService.create(createTwaroomDto);
    }
    findAll() {
        return this.twaroomService.findAll();
    }
    async findOne(room_id) {
        return await this.twaroomService.findOne(room_id);
    }
    add_message(room_id, message) {
        return this.twaroomService.add_message(room_id, message);
    }
    remove(id) {
        return this.twaroomService.remove(+id);
    }
};
exports.TwaroomController = TwaroomController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_twaroom_dto_1.CreateTwaroomDto]),
    __metadata("design:returntype", void 0)
], TwaroomController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TwaroomController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':room_id'),
    __param(0, (0, common_1.Param)('room_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TwaroomController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':room_id'),
    __param(0, (0, common_1.Param)('room_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, twamessage_schema_1.TwaMessage]),
    __metadata("design:returntype", void 0)
], TwaroomController.prototype, "add_message", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TwaroomController.prototype, "remove", null);
exports.TwaroomController = TwaroomController = __decorate([
    (0, common_1.Controller)('twaroom'),
    __metadata("design:paramtypes", [twaroom_service_1.TwaroomService])
], TwaroomController);
//# sourceMappingURL=twaroom.controller.js.map