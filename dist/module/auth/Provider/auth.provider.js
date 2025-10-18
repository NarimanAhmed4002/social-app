"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authProvider = void 0;
const DB_1 = require("../../../DB");
const utils_1 = require("../../../utils");
exports.authProvider = {
    async checkOTP(verifyAccountDTO) {
        const userRepository = new DB_1.UserRepository();
        // check if user exists
        const userExist = await userRepository.Exist({ email: verifyAccountDTO.email });
        if (!userExist)
            throw new utils_1.NotFoundException("User not found"); // global
        // check otp
        if (userExist.otp !== verifyAccountDTO.otp)
            throw new utils_1.BadRequestException("Invalid OTP"); // global
        // check expiry at
        if (userExist.otpExpireAt < new Date())
            throw new utils_1.BadRequestException("Expired OTP"); // global
    },
    async updateUser(filter, update) {
        const userRepository = new DB_1.UserRepository();
        await userRepository.update(filter, update);
    }
};
