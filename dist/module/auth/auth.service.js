"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const auth_provider_1 = require("./Provider/auth.provider");
class authService {
    userRepository = new DB_1.UserRepository();
    authFactoryService = new factory_1.AuthFactoryService();
    constructor() {
        // this.register = this.register.bind(this) // to make "this" refer to the class not to the window
    }
    register = async (req, res) => {
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
        delete user.otp;
        delete user.otpExpireAt;
        // send response
        return res.status(201).json({
            message: "User created successfully.",
            success: true,
            data: { user }
        });
    };
    verifyAccount = async (req, res) => {
        // get data from req
        const verifyAccountDTO = req.body;
        await auth_provider_1.authProvider.checkOTP(verifyAccountDTO);
        await auth_provider_1.authProvider.updateUser({ email: verifyAccountDTO.email }, { isVerified: true, $unset: { otp: "", otpExpiryeAt: "" } });
        return res.sendStatus(204); // no content in response >> done
        // sendStatus not status only to end the response
    };
    login = async (req, res) => {
        // get data from req
        const loginDTO = req.body;
        // check existence
        const userExist = await this.userRepository.Exist({ email: loginDTO.email });
        if (!userExist) {
            throw new utils_1.ForbiddenException("Invalid credintials.");
        }
        ;
        // compare password
        if (!await (0, utils_1.compareHash)(loginDTO.password, userExist.password)) {
            throw new utils_1.ForbiddenException("Invalid credintials.");
        }
        ;
        const accessToken = (0, utils_1.generateToken)({
            payload: { _id: userExist._id,
                role: userExist.role
            },
            options: { expiresIn: "1d" }
        });
        // send response
        return res.status(200).json({
            message: "User logged in successfully.",
            success: true,
            data: { accessToken }
        });
    };
}
;
exports.default = new authService();
// Contains business logic — e.g., verifying passwords, creating JWT tokens.
// service functions do not have next parameter because they do not handle errors directly, 
// but middlewares must have it(next parameter) to pass errors to the next middleware.
