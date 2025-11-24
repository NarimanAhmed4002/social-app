"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const DB_1 = require("../DB");
const utils_1 = require("../utils");
const token_1 = require("../utils/token");
const isAuthenticated = () => {
    return async (req, res, next) => {
        const token = req.headers.authorization;
        const payload = (0, token_1.verifyToken)(token);
        const userRepository = new DB_1.UserRepository();
        const user = await userRepository.Exist({ _id: payload._id });
        if (!user)
            throw new utils_1.NotFoundException("User not found.");
        // implementation >> check token >> logout from all devices [credentials updated at]
        req.user = user;
        next();
    };
};
exports.isAuthenticated = isAuthenticated;
