"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify2FA = exports.emailAndOtp = exports.updateEmail = exports.updateBasicInfoDTO = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.updateBasicInfoDTO = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(30).optional(),
    // lastName: z.string().min(3).max(30).optional() as unknown as string,
    phone: zod_1.z.string().optional().optional(),
    gender: zod_1.z.enum(utils_1.GENDER).optional()
});
exports.updateEmail = zod_1.z.object({
    email: (0, zod_1.email)({ error: "Invalid email" })
});
// defines the properties of UpdateDTO(the data we expect to receive from user in body).
// Used to validate incoming request data (e.g., req.body) before processing.
// Ensures data integrity and provides clear error messages if validation fails.
// Validates inputs for updating user information.
exports.emailAndOtp = zod_1.z.object({
    oldCode: zod_1.z.string().regex(/^\d{6}$/),
    newCode: zod_1.z.string().regex(/^\d{6}$/),
});
exports.verify2FA = {
    otp: zod_1.z.string().length(5, "OTP must be 5 characters long"),
};
