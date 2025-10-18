"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const utils_3 = require("../../../utils");
const entity_1 = require("../entity");
class AuthFactoryService {
    register(registerDTO) {
        const user = new entity_1.User();
        user.fullName = registerDTO.fullName;
        user.email = registerDTO.email;
        user.password = (0, utils_2.generateHash)(registerDTO.password);
        user.phone = registerDTO.phone;
        user.otp = (0, utils_3.generateOTP)();
        user.otpExpireAt = (0, utils_3.generateExpiryDate)(15 * 60 * 1000);
        user.credentialsUpdatedAt = Date.now();
        user.role = utils_1.SYS_ROLE.user;
        user.gender = registerDTO.gender;
        user.userAgent = utils_1.USER_AGENT.local;
        user.isVerified = false;
        return user;
    }
}
exports.AuthFactoryService = AuthFactoryService;
