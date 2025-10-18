"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthFactoryService = void 0;
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
const utils_3 = require("../../../utils");
const entity_1 = require("../entity");
class AuthFactoryService {
    // registerDTO : data from request body(values)
    register(registerDTO) {
        const user = new entity_1.User(); // instance of User model to assign values to it
        user.fullName = registerDTO.fullName;
        user.email = registerDTO.email;
        user.password = (0, utils_2.generateHash)(registerDTO.password); // assign hashed password to the password field
        user.phone = registerDTO.phone;
        user.otp = (0, utils_3.generateOTP)();
        user.otpExpireAt = (0, utils_3.generateExpiryDate)(15 * 60 * 1000);
        user.credentialsUpdatedAt = Date.now();
        user.role = utils_1.SYS_ROLE.user;
        user.gender = registerDTO.gender;
        user.userAgent = utils_1.USER_AGENT.local;
        user.isVerified = false;
        return user; // return the user document with all fields assigned to save it later in DB
    }
}
exports.AuthFactoryService = AuthFactoryService;
;
// prepare data and convert it to user document : hashing - encryption - otp - translation
// Creates service or controller instances — useful for dependency injection 
// (helps manage app components cleanly).
