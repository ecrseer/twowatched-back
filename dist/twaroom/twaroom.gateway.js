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
exports.TwaroomGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const twaroom_service_1 = require("./twaroom.service");
let TwaroomGateway = class TwaroomGateway {
    twaroomService;
    ROLEPLAY_WAIT_ROOM_PREFIX = `likes_movie_`;
    constructor(twaroomService) {
        this.twaroomService = twaroomService;
    }
    afterInit(server) {
        console.log('🚀 ~ afterInit ~ server:');
    }
    server;
    handleConnection(client, ...args) {
        console.log('connected');
    }
    handleDisconnect(client) {
        console.log('disconnected');
    }
    handleMessage(data, client) {
        console.log('🚀 ~ data:', data);
        const transformed = +data.abc * 2;
        client.send({ transformed });
        const all = this.twaroomService.findAll().then((data) => {
            console.log('🚀 ~ all:', data);
        });
    }
    client_join_room(data, client) {
        console.log('🚀 ~ join room:', data);
        client.join(data.room_id);
    }
    client_sent_message(user, client) {
        this.twaroomService.add_message(user.room_id, {
            content: user.message,
            sender_user_id: user.sender_user_id,
        });
        client.to(user.room_id).emit('append_message', user);
    }
    client_enter_roleplay_notifications_room(dto, client) {
        for (const movie of dto?.moviesList) {
            this.enter_roleplay_room(movie, client);
        }
    }
    enter_roleplay_room(movie, client) {
        client.join(this.get_roleplay_room(movie));
    }
    client_request_roleplay_chat(dto, client) {
        this.send_roleplay_room_request(dto.priority, client);
    }
    send_roleplay_room_request(movie, client) {
        const room = this.get_roleplay_room(movie);
        client
            .to(room)
            .emit('wants_movie_roleplay', { movie, client_id: client.id });
    }
    get_roleplay_room(movie) {
        const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${movie.name || movie.title}`;
        return room;
    }
};
exports.TwaroomGateway = TwaroomGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TwaroomGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_join_room", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_sent_message", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter_roleplay_notifications_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_enter_roleplay_notifications_room", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_roleplay_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_request_roleplay_chat", null);
exports.TwaroomGateway = TwaroomGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [twaroom_service_1.TwaroomService])
], TwaroomGateway);
//# sourceMappingURL=twaroom.gateway.js.map