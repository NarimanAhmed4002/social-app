"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB");
const utils_1 = require("../../utils");
const factory_1 = require("./factory");
class UserService {
    userRepository = new DB_1.UserRepository();
    userFactoryService = new factory_1.UserFactoryService();
    constructor() { }
    getProfile = async (req, res) => {
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
        const [firstName, lastName] = fullName?.split(" ");
        // console.log(user);
        const updateUser = await this.userRepository.update({ _id: userId }, { $set: user, firstName, lastName });
        console.log(updateUser);
        return res.status(200).json({
            message: "User basic info updated successfully",
            success: true,
            data: { updateUser },
        });
    };
    updateEmail = async (req, res) => {
        const { email } = req.body;
        const userEmail = req.user?.email;
        const emailExist = await this.userRepository.Exist({ email: email });
        if (emailExist)
            throw new utils_1.ConflictException("Email already exist");
        const oldOTP = await (0, utils_1.generateOTP)();
        const newOTP = await (0, utils_1.generateOTP)();
        await this.userRepository.update({ email: email }, {
            $set: {
                tempEmail: email,
                otpOldEmail: (0, utils_1.generateHash)(oldOTP.toString()),
                otpNewEmail: (0, utils_1.generateHash)(newOTP.toString()),
                otpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        (0, utils_1.sendMail)({
            to: userEmail,
            subject: "Confirmation email.",
            html: `<p>Your OTP to confirm email change is: <b>${oldOTP}</b></p>`,
        });
        (0, utils_1.sendMail)({
            to: email,
            subject: "Confirmation email.",
            html: `<p>Your OTP to confirm email change is: <b>${newOTP}</b></p>`,
        });
        return res.status(200).json({
            message: "OTPs sent to old and new email addresses successfully.",
            success: true,
        });
    };
    replaceEmail = async (req, res) => {
        const { oldCode, newCode } = req.body;
        const userEmail = req.user?.email;
        if (req.user?.otpExpireAt?.getTime() < Date.now())
            throw new utils_1.BadRequestException("OTP expired!");
        if (!(await (0, utils_1.compareHash)(oldCode, req.user?.otpOldEmail)))
            throw new utils_1.BadRequestException("Old email OTP is invalid!");
        if (!(await (0, utils_1.compareHash)(newCode, req.user?.otpNewEmail)))
            throw new utils_1.BadRequestException("New email OTP is invalid!");
        await this.userRepository.update({ email: userEmail }, {
            $set: {
                email: req.user?.tempEmail,
                credentialsUpdatedAt: Date.now(),
            },
            $unset: {
                tempEmail: 1,
                otpOldEmail: 1,
                otpNewEmail: 1,
                otpExpireAt: 1,
            },
        });
        return res.status(200).json({
            message: "Email updated successfully.",
            success: true,
        });
    };
    enable2FA = async (req, res) => {
        const email = req.user?.email;
        const otp = (0, utils_1.generateOTP)();
        if (req.user?.is2FAEnabled)
            throw new utils_1.BadRequestException("2FA is already enabled.");
        if (req.user?.twoFAOTPExpireAt && req.user?.twoFAOTPExpireAt?.getTime() > Date.now()) {
            throw new utils_1.BadRequestException("OTP is not expired yet!");
        }
        await this.userRepository.update({ email: email }, {
            $set: {
                twoFAOTP: (0, utils_1.generateHash)(otp.toString()),
                twoFAOTPExpireAt: new Date(Date.now() + 10 * 60 * 1000),
            },
        });
        (0, utils_1.sendMail)({
            to: email,
            subject: "2 step-verification authentication.",
            html: `<p>Your OTP for 2 step-verification authentication is: <b>${otp}</b></p>`,
        });
        return res.status(200).json({
            message: "2FA enabled successfully. ",
            success: true,
        });
    };
    verify2FA = async (req, res) => {
        const { otp } = req.body;
        const email = req.user?.email;
        if (req.user?.twoFAOTPExpireAt?.getTime() < Date.now())
            throw new utils_1.BadRequestException("OTP expired!");
        if (!(await (0, utils_1.compareHash)(otp, req.user?.twoFAOTP)))
            throw new utils_1.BadRequestException("Invalid OTP!");
        await this.userRepository.update({ email: email }, {
            $set: {
                is2FAEnabled: true,
            },
            $unset: {
                twoFAOTP: 1,
                twoFAOTPExpireAt: 1
            }
        });
        return res.status(200).json({
            message: "2 step-verification authentication successfully. ",
            success: true,
        });
    };
}
exports.default = new UserService();
