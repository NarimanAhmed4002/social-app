"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBasicInfoDTO = void 0;
const zod_1 = require("zod");
const utils_1 = require("../../utils");
exports.updateBasicInfoDTO = zod_1.z.object({
    fullName: zod_1.z.string().min(3).max(30).optional(),
    // lastName: z.string().min(3).max(30).optional() as unknown as string,
    phone: zod_1.z.string().optional().optional(),
    gender: zod_1.z.enum(utils_1.GENDER).optional()
});
