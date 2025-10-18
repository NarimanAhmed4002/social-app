"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const token_1 = require("../utils/token");
const isAuthenticated = (req, res, next) => {
    const token = req.headers.authorization;
    const payload = (0, token_1.verifyToken)(token);
    payload._id;
};
exports.isAuthenticated = isAuthenticated;
