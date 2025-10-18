"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dev_config_1 = require("../../config/env/dev.config");
const sendEmail = async (mailOptions) => {
    // create transporter
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: dev_config_1.devConfig.EMAIL,
            pass: dev_config_1.devConfig.PASSWORD,
        },
    });
    mailOptions.from = `Social App <${dev_config_1.devConfig.EMAIL}>`;
    await transporter.sendMail(mailOptions);
};
exports.sendEmail = sendEmail;
// functions to send verification or notification emails.
