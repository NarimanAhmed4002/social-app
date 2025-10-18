"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValid = void 0;
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
    };
};
exports.isValid = isValid;
