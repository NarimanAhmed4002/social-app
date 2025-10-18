"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareHash = exports.generateHash = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateHash = (password) => {
    return bcryptjs_1.default.hashSync(password, 10);
};
exports.generateHash = generateHash;
const compareHash = async (password, hashPassword) => {
    return await bcryptjs_1.default.compare(password, hashPassword);
};
exports.compareHash = compareHash;
// Utility functions for hashing passwords and comparing hashes.
// password hashing utilities (e.g., using bcrypt).
