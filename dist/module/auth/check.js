"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("../../DB/model/user/user.model");
const error_1 = require("../../utils/error");
class Auth {
    constructor() { }
    async Register(req, res, next) {
        // get data from body
        const data = req.body;
        // check existense
        const userExist = await user_model_1.User.findOne({ email: data.email });
        if (userExist) {
            throw new error_1.ConflictException("user exist");
        }
        // prepare 
        const user = new user_model_1.User(data);
        const createdUser = await user.save();
    }
}
exports.default = new Auth();
