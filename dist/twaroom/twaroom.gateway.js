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
    handleDisconnect(client) {
        console.log('🚀 ~ handleDisconnect ~ client:', client?.rooms);
    }
    server;
    afterInit(server) {
    }
    client_enter_roleplay_notifications_room(client, dto) {
        for (const movie of dto.moviesList) {
            client.join(this.roleplay_room_name(movie));
        }
        return Array.from(client.rooms);
    }
    roleplay_room_name(movie) {
        const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${movie.name || movie.title}`;
        return room;
    }
    roleplay_room_acceptance_name(movie) {
        const room = `${this.ROLEPLAY_WAIT_ROOM_PREFIX}${movie.name || movie.title}_pool_`;
        return room;
    }
    client_enter_room(dto, client) {
        client.join(dto.room_id);
    }
    client_request_roleplay_chat(dto, client) {
        this.send_roleplay_room_request(dto.priority, client);
    }
    async send_roleplay_room_request(movie, client) {
        console.log('~☠️ ~ TwaroomGateway ~ send_roleplay_room_request ~ movie:', movie);
        const room = this.roleplay_room_name(movie);
        const MOCK_USER_ID = new Date().getSeconds();
        const notification = {
            title: 'Someone wants to roleplay!',
            description: `${MOCK_USER_ID} wants to roleplay ${movie.name || movie.title}!`,
            type: 'info',
        };
        client
            .to(room)
            .emit('receive_request_roleplay_chat', { notification, movie });
        client.join(this.roleplay_room_acceptance_name(movie));
    }
    get_client_room_pools(client) {
        return Array.from(client.rooms).filter((room) => /_pool_/gi.test(room));
    }
    async client_accept_roleplay_room_request(movie, client) {
        const acceptance_room = this.roleplay_room_acceptance_name(movie);
        client.join(acceptance_room);
        const { room } = await this.twaroomService.create();
        client.in(acceptance_room).emit('accepted_roleplay_enter_room', room);
        client.emit('accepted_roleplay_enter_room', room);
    }
    client_sent_message(user, client) {
        this.twaroomService.add_message(user.room_id, {
            content: user.content,
            sender_user_id: user.sender_user_id,
        });
        client.to(user.room_id).emit('append_message', user);
    }
};
exports.TwaroomGateway = TwaroomGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], TwaroomGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter_roleplay_notifications_room'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_enter_roleplay_notifications_room", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('enter_room'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_enter_room", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('request_roleplay_chat'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_request_roleplay_chat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('accept_roleplay_room_request'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], TwaroomGateway.prototype, "client_accept_roleplay_room_request", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], TwaroomGateway.prototype, "client_sent_message", null);
exports.TwaroomGateway = TwaroomGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: true }),
    __metadata("design:paramtypes", [twaroom_service_1.TwaroomService])
], TwaroomGateway);
//# sourceMappingURL=twaroom.gateway.js.map