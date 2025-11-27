"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalFields = exports.isValid = void 0;
const zod_1 = __importDefault(require("zod"));
const utils_1 = require("../utils");
const isValid = (schema) => {
    return (req, res, next) => {
        // validation
        // validate body
        let data = { ...req.body, ...req.params, ...req.query };
        const result = schema.safeParse(data);
        console.log(result);
        if (result.success === false) {
            let errMessages = result.error.issues.map((issues) => ({
                path: issues.path[0],
                message: issues.message
            }));
            console.log(errMessages);
            throw new utils_1.BadRequestException("validation failed", errMessages);
        }
        return next();
    };
};
exports.isValid = isValid;
// checks request data before it hits controllers.
/**
 * Middleware helps manage tasks like:

    1- Authentication (verify tokens).
    2- Validation (check request inputs).
    3- Logging, CORS, etc.

* They run before controllers to filter or modify requests.
 */
exports.generalFields = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(8).max(50),
    otp: zod_1.default.string().length(5),
    phoneNumber: zod_1.default.string().length(11),
    name: zod_1.default.string().min(3).max(50),
    dob: zod_1.default.date(),
    confirmPassword: zod_1.default.string().min(8).max(50),
    objectId: zod_1.default.string().regex(/^[0-9a-fA-F]{24}$/), // أفضل من hex().length(24)
    headers: zod_1.default.object({
        authorization: zod_1.default.string().min(1, "token is required!"),
        accept: zod_1.default.string().optional(),
        host: zod_1.default.string().optional(),
        "accept-encoding": zod_1.default.string().optional(),
        "content-type": zod_1.default.string().optional(),
        "user-agent": zod_1.default.string().optional(),
        "cache-control": zod_1.default.string().optional(), // صححت spelling
        "postman-token": zod_1.default.string().optional(),
        "content-length": zod_1.default.string().optional(),
        connection: zod_1.default.string().optional(),
    })
});
