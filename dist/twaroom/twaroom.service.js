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
exports.TwaroomService = void 0;
const common_1 = require("@nestjs/common");
const twaroom_schema_1 = require("./entities/twaroom.schema");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TwaroomService = class TwaroomService {
    TwaroomModel;
    constructor(TwaroomModel) {
        this.TwaroomModel = TwaroomModel;
    }
    async create(createRoomDto) {
        const MOCK_ROOM = {
            name: `${new Date().toLocaleDateString()}-name`,
            media_story_id: `${new Date().toLocaleDateString()}-slime`,
            messages: [],
        };
        const created = new this.TwaroomModel(createRoomDto || MOCK_ROOM);
        const room = await created.save();
        return { room, created };
    }
    async findAll() {
        return await this.TwaroomModel.find();
    }
    async findOne(room_id) {
        return await this.TwaroomModel.findOne({ _id: room_id }).exec();
    }
    async add_message(room_id, message) {
        const updated = await this.TwaroomModel.updateOne({ _id: room_id }, { $push: { messages: message } });
        return { updated };
    }
    remove(id) {
        return `This action removes a #${id} twaroom`;
    }
};
exports.TwaroomService = TwaroomService;
exports.TwaroomService = TwaroomService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(twaroom_schema_1.Twaroom.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TwaroomService);
//# sourceMappingURL=twaroom.service.js.map