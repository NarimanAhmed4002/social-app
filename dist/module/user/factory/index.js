"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserFactoryService = void 0;
const entity_1 = require("../entity");
class UserFactoryService {
    updateBasicInfo(updateDTO) {
        const user = new entity_1.UpdateUser();
        user.fullName = updateDTO.fullName;
        user.phone = updateDTO.phone;
        user.gender = updateDTO.gender;
        return user;
    }
}
exports.UserFactoryService = UserFactoryService;
