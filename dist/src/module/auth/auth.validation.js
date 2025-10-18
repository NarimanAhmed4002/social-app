"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSchema = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
// all fields are required except by defult from zod
// we can use .optional() to make it optional
// we can use .nullable() to make it nullable
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(30),
    email: zod_1.z.email({ error: "Invalid email example@gmail.com expected." }),
    password: zod_1.z.string().min(8),
    phone: zod_1.z.string().optional(),
    gender: zod_1.z.enum(utils_1.GENDER)
});
