"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectdb = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectdb = async () => {
    await mongoose_1.default.connect(process.env.DB_URL)
        .then(() => {
        console.log("Connected to database successfully.");
    }).catch((err) => {
        console.log("Failed to connect to database.", err);
    });
};
exports.connectdb = connectdb;
