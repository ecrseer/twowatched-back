"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTwaroomDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_twaroom_dto_1 = require("./create-twaroom.dto");
class UpdateTwaroomDto extends (0, mapped_types_1.PartialType)(create_twaroom_dto_1.CreateTwaroomDto) {
}
exports.UpdateTwaroomDto = UpdateTwaroomDto;
//# sourceMappingURL=update-twaroom.dto.js.map