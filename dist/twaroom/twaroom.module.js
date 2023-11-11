"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwaroomModule = void 0;
const common_1 = require("@nestjs/common");
const twaroom_service_1 = require("./twaroom.service");
const twaroom_controller_1 = require("./twaroom.controller");
const twaroom_schema_1 = require("./entities/twaroom.schema");
const mongoose_1 = require("@nestjs/mongoose");
const twaroom_gateway_1 = require("./twaroom.gateway");
let TwaroomModule = class TwaroomModule {
};
exports.TwaroomModule = TwaroomModule;
exports.TwaroomModule = TwaroomModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: twaroom_schema_1.Twaroom.name, schema: twaroom_schema_1.TwaroomSchema }]),
        ],
        controllers: [twaroom_controller_1.TwaroomController],
        providers: [twaroom_service_1.TwaroomService, twaroom_gateway_1.TwaroomGateway],
    })
], TwaroomModule);
//# sourceMappingURL=twaroom.module.js.map