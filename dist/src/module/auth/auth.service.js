"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
class authService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() {
        // this.register = this.register.bind(this) // to make "this" refer to the class not to the window
    }
    register = async (req, res, next) => {
        // get data from body
        const registerDTO = req.body;
        // check existence
        const userExist = await this.userRepository.Exist({ email: registerDTO.email });
        if (userExist) {
            throw new utils_1.ConflictException("User already exists");
        }
        // prepare data and convert it to user document : hashing - encryption - otp - translation
        const user = this.authFactoryService.register(registerDTO);
        // save into DB
        const createdUser = await this.userRepository.create(user);
        // send response
        return res.status(201).json({
            message: "User created successfully.",
            success: true,
            data: createdUser
        });
    };
}
exports.default = new authService();
