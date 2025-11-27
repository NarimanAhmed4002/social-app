import { Request, Response } from "express";
import { UserRepository } from "../../DB";
import {
  BadRequestException,
  compareHash,
  ConflictException,
  generateHash,
  generateOTP,
  NotFoundException,
  sendMail,
} from "../../utils";
import { UserFactoryService } from "./factory";
import { EmailAndOtpDTO, UpdateDTO, UpdateEmailDTO, Verify2FADTO } from "./user.dto";

class UserService {
  private readonly userRepository = new UserRepository();
  private readonly userFactoryService = new UserFactoryService();
  constructor() {}

  getProfile = async (req: Request, res: Response) => {
    let user = await this.userRepository.getOne({ _id: req.params.id });
    return res.status(200).json({
      message: "Done",
      success: true,
      data: { user: req.user },
    });
  };

  updateBasicInfo = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { fullName, phone, gender }: UpdateDTO = req.body;
    const userExist = await this.userRepository.Exist({ _id: userId });
    if (!userExist) throw new NotFoundException("User not found");
    const user = this.userFactoryService.updateBasicInfo({
      fullName,
      phone,
      gender,
    });
    const [firstName, lastName] = fullName?.split(" ");
    // console.log(user);
    const updateUser = await this.userRepository.update(
      { _id: userId },
      { $set: user, firstName, lastName }
    );
    console.log(updateUser);

    return res.status(200).json({
      message: "User basic info updated successfully",
      success: true,
      data: { updateUser },
    });
  };

  updateEmail = async (req: Request, res: Response) => {
    const { email }: UpdateEmailDTO = req.body;
    const userEmail = req.user?.email;
    const emailExist = await this.userRepository.Exist({ email: email });
    if (emailExist) throw new ConflictException("Email already exist");
    const oldOTP = await generateOTP();
    const newOTP = await generateOTP();

    await this.userRepository.update(
      { email: email },
      {
        $set: {
          tempEmail: email,
          otpOldEmail: generateHash(oldOTP.toString()),
          otpNewEmail: generateHash(newOTP.toString()),
          otpExpireAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      }
    );

    sendMail({
      to: userEmail,
      subject: "Confirmation email.",
      html: `<p>Your OTP to confirm email change is: <b>${oldOTP}</b></p>`,
    });

    sendMail({
      to: email,
      subject: "Confirmation email.",
      html: `<p>Your OTP to confirm email change is: <b>${newOTP}</b></p>`,
    });

    return res.status(200).json({
      message: "OTPs sent to old and new email addresses successfully.",
      success: true,
    });
  };

  replaceEmail = async (req: Request, res: Response) => {
    const { oldCode, newCode }: EmailAndOtpDTO = req.body;
    const userEmail = req.user?.email;
    if ((req.user?.otpExpireAt?.getTime() as number) < Date.now())
      throw new BadRequestException("OTP expired!");
    if (!(await compareHash(oldCode, req.user?.otpOldEmail as string)))
      throw new BadRequestException("Old email OTP is invalid!");
    if (!(await compareHash(newCode, req.user?.otpNewEmail as string)))
      throw new BadRequestException("New email OTP is invalid!");

    await this.userRepository.update(
      { email: userEmail },
      {
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
      }
    );

    return res.status(200).json({
      message: "Email updated successfully.",
      success: true,
    });
  };

  enable2FA = async (req: Request, res: Response) => {
    const email = req.user?.email;
    const otp = generateOTP();
    if (req.user?.is2FAEnabled)
      throw new BadRequestException("2FA is already enabled.");

    if( req.user?.twoFAOTPExpireAt && (req.user?.twoFAOTPExpireAt?.getTime() as number) > Date.now()){
      throw new BadRequestException("OTP is not expired yet!");
    }
    await this.userRepository.update(
      { email: email },
      {
        $set: {
          twoFAOTP: generateHash(otp.toString()),
          twoFAOTPExpireAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      }
    );
    sendMail({
      to: email,
      subject: "2 step-verification authentication.",
      html: `<p>Your OTP for 2 step-verification authentication is: <b>${otp}</b></p>`,
    })
    return res.status(200).json({
      message: "2FA enabled successfully. ",
      success: true,
    });
  };

  verify2FA = async (req: Request, res: Response) => {
    const { otp }: Verify2FADTO = req.body;
    const email = req.user?.email;
    if( (req.user?.twoFAOTPExpireAt?.getTime() as number) < Date.now()) throw new BadRequestException("OTP expired!");
    if(!(await compareHash(otp, req.user?.twoFAOTP as string))) throw new BadRequestException("Invalid OTP!");
    await this.userRepository.update({email:email}, {
      $set:{
        is2FAEnabled:true,
      },
      $unset:{
        twoFAOTP:1,
        twoFAOTPExpireAt:1
      }});
    return res.status(200).json({
      message: "2 step-verification authentication successfully. ",
      success: true,
    });
   
  };

}

export default new UserService();
