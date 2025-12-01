import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import { FriendRequestRepository, UserRepository } from "../../DB";
import {
  BadRequestException,
  compareHash,
  ConflictException,
  FRIENDREQUESTSTATUS,
  generateHash,
  generateOTP,
  NotFoundException,
  sendMail,
  UnAuthorizedException,
} from "../../utils";
import { UserFactoryService } from "./factory";
import {
  EmailAndOtpDTO,
  UpdateDTO,
  UpdateEmailDTO,
  Verify2FADTO,
} from "./user.dto";
import fr from "zod/v4/locales/fr.js";

class UserService {
  private readonly userRepository = new UserRepository();
  private readonly userFactoryService = new UserFactoryService();
  private readonly friendRequestRepository = new FriendRequestRepository();
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

    if (
      req.user?.twoFAOTPExpireAt &&
      (req.user?.twoFAOTPExpireAt?.getTime() as number) > Date.now()
    ) {
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
    });
    return res.status(200).json({
      message: "2FA enabled successfully. ",
      success: true,
    });
  };

  verify2FA = async (req: Request, res: Response) => {
    const { otp }: Verify2FADTO = req.body;
    const email = req.user?.email;
    if ((req.user?.twoFAOTPExpireAt?.getTime() as number) < Date.now())
      throw new BadRequestException("OTP expired!");
    if (!(await compareHash(otp, req.user?.twoFAOTP as string)))
      throw new BadRequestException("Invalid OTP!");
    await this.userRepository.update(
      { email: email },
      {
        $set: {
          is2FAEnabled: true,
        },
        $unset: {
          twoFAOTP: 1,
          twoFAOTPExpireAt: 1,
        },
      }
    );
    return res.status(200).json({
      message: "2 step-verification authentication successfully. ",
      success: true,
    });
  };

  sendFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { receiverId } = req.params;

    if (!userId) throw new BadRequestException("User not found!");
    if (userId.toString() === receiverId.toString())
      throw new BadRequestException(
        "You can't send friend request to yourself!"
      );
    const receiverExist = await this.userRepository.Exist({ _id: receiverId });
    if (!receiverExist) throw new NotFoundException("Receiver not found!");

    const requestExist = await this.friendRequestRepository.Exist({
      from: userId,
      to: receiverId,
      status: FRIENDREQUESTSTATUS.pending,
    });
    if (requestExist)
      throw new BadRequestException("Friend request already sent!");

    const request = await this.friendRequestRepository.create({
      from: userId,
      to: receiverId as unknown as ObjectId,
    });

    return res.status(200).json({
      message: "Friend request sent successfully.",
      success: true,
      data: { request },
    });
  };

  acceptFriendRequest = async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { receiverId } = req.params;
    if (!userId) throw new NotFoundException("User not found!");

    const friendRequest = await this.friendRequestRepository.Exist({
      _id: receiverId,
    });
    if (!friendRequest)
      throw new NotFoundException("Friend request not found!");

    if (userId.toString() !== receiverId.toString())
      throw new UnAuthorizedException(
        "You are not authorized to accept this friend request!"
      );

    if (friendRequest.status !== FRIENDREQUESTSTATUS.pending)
      throw new ConflictException("Friend request is not pending!");

    friendRequest.status = FRIENDREQUESTSTATUS.accepted;
    await friendRequest.save();

    await this.friendRequestRepository.update(
      { _id: userId },
      { $addToSet: { from: friendRequest.from } }
    );

    return res.status(200).json({
      message: "Friend request accepted successfully.",
      success: true,
    });
  };

  deleteFriendRequest = async (req: Request, res: Response) => {
    const { receiverId } = req.params;
    const user = req.user;

    const friendRequest = await this.friendRequestRepository.Exist({
      _id: receiverId,
      status: FRIENDREQUESTSTATUS.pending,
    });

    if (!friendRequest)
      throw new NotFoundException("Friend request not found!");

    const isParticipant =
      user._id.toString() == friendRequest.from.toString() ||
      user._id.toString() == friendRequest.to.toString();

    if (!isParticipant)
      throw new UnAuthorizedException(
        "You are not authorized to delete this friend request!"
      );

    await this.friendRequestRepository.delete({ _id: receiverId });

    return res.status(200).json({
      message: "Friend request deleted successfully.",
      success: true,
    });
  };

  unfriend = async (req: Request, res: Response) => {
    const { friendId } = req.params;
    const user = req.user;

    if (user._id.toString() === friendId.toString())
      throw new BadRequestException("You can't unfriend yourself!");

    const friend = await this.userRepository.Exist({ _id: friendId });
    if (!friend) throw new NotFoundException("Friend is not found!");

    if (!user.friends.includes(friend._id))
      throw new BadRequestException("You are not friends with this user!");

    await this.userRepository.update(
      { _id: user._id },
      { $pull: { friends: friend._id } }
    );
    await this.userRepository.update(
      { _id: friend._id },
      { $pull: { friends: user._id } }
    );

    return res.status(200).json({
      message: "User unfriended successfully.",
      success: true,
    });
  };

  blockUser = async (req: Request, res: Response) => {
    const { blockedUserId } = req.params;
    const user = req.user;

    if (user._id.toString() === blockedUserId.toString())
      throw new BadRequestException("You can't block yourself!");

    const targetUser = await this.userRepository.Exist({ _id: blockedUserId });
    if (!targetUser)
      throw new NotFoundException("user to be blocked is not found!");

    if (user.friends.includes(targetUser._id)) {
      await this.userRepository.update(
        { _id: user._id },
        { $pull: { friends: targetUser._id } }
      );
      await this.userRepository.update(
        { _id: targetUser._id },
        { $pull: { targetUsers: user._id } }
      );
    }

    await this.userRepository.update(
      { _id: user._id },
      { $addToSet: { blocked: targetUser._id } }
    );

    return res.status(200).json({
      message: "User blocked successfully.",
      success: true,
    });
  };
}

export default new UserService();
