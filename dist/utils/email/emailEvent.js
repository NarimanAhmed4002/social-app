"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailEvent = void 0;
const index_js_1 = require("../email/index.js");
const events_1 = require("events");
const emailTemplate_js_1 = require("./emailTemplate.js");
exports.emailEvent = new events_1.EventEmitter();
exports.emailEvent.on("sendEmail", async (data) => {
    let { name, email, otp } = data;
    const success = await (0, index_js_1.sendMail)({
        subject: "Confirm Email",
        html: (0, emailTemplate_js_1.emailTemplate)({
            emailSubject: "Confirm Email",
            body: `
            <p>Thank you for using our platform. Below is your verification code:</p>
            <p>Please enter this code in the app to complete your verification. The code is valid for 3 minutes.</p>
            <p>If you did not request this code, please ignore this email or contact our support team.</p>
            `,
            otp
        }),
        to: email,
    });
    success ? console.log("Email sent successfully") : console.log("Email failed to send");
});
