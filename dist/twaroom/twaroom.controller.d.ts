/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { TwaroomService } from './twaroom.service';
import { CreateTwaroomDto } from './dto/create-twaroom.dto';
import { TwaMessage } from './entities/twamessage.schema';
export declare class TwaroomController {
    private readonly twaroomService;
    constructor(twaroomService: TwaroomService);
    create(createTwaroomDto: CreateTwaroomDto): Promise<{
        result: Promise<import("mongoose").Document<unknown, {}, import("./entities/twaroom.schema").Twaroom> & import("./entities/twaroom.schema").Twaroom & {
            _id: import("mongoose").Types.ObjectId;
        }>;
        created: import("mongoose").Document<unknown, {}, import("./entities/twaroom.schema").Twaroom> & import("./entities/twaroom.schema").Twaroom & {
            _id: import("mongoose").Types.ObjectId;
        };
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./entities/twaroom.schema").Twaroom> & import("./entities/twaroom.schema").Twaroom & {
        _id: import("mongoose").Types.ObjectId;
    })[]>;
    findOne(room_id: string): Promise<import("mongoose").Document<unknown, {}, import("./entities/twaroom.schema").Twaroom> & import("./entities/twaroom.schema").Twaroom & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    add_message(room_id: string, message: TwaMessage): Promise<{
        updated: import("mongoose").UpdateWriteOpResult;
    }>;
    remove(id: string): string;
}
