"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const factory_1 = require("./factory");
const utils_1 = require("../../utils");
class UserService {
    userRepository = new DB_1.UserRepository();
    userFactoryService = new factory_1.UserFactoryService();
    constructor() { }
    getProfile = async (req, res, next) => {
        let user = await this.userRepository.getOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Done",
            success: true,
            data: { user: req.user },
        });
    };
    updateBasicInfo = async (req, res) => {
        const userId = req.user?._id;
        const { fullName, phone, gender } = req.body;
        const userExist = await this.userRepository.Exist({ _id: userId });
        if (!userExist)
            throw new utils_1.NotFoundException("User not found");
        const user = this.userFactoryService.updateBasicInfo({
            fullName,
            phone,
            gender,
        });
        // console.log(user);
        const updateUser = await this.userRepository.update({ _id: userId }, { $set: user });
        console.log(updateUser);
        return res.status(200).json({
            message: "User basic info updated successfully",
            success: true,
            data: { updateUser }
        });
    };
}
exports.default = new UserService();
