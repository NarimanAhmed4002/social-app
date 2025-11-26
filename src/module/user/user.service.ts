import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";
import { UserFactoryService } from "./factory";
import { UpdateDTO } from "./user.dto";
import { NotFoundException } from "../../utils";

class UserService {
  private readonly userRepository = new UserRepository();
  private readonly userFactoryService = new UserFactoryService();
  constructor() {}

  getProfile = async (req: Request, res: Response, next: NextFunction) => {
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
    const userExist = await this.userRepository.Exist({_id: userId});
    if (!userExist) throw new NotFoundException("User not found");
    const user = this.userFactoryService.updateBasicInfo({
      fullName,
      phone,
      gender,
    });
    // console.log(user);
    const updateUser = await this.userRepository.update({_id:userId}, {$set:user});
    console.log(updateUser);
  
    return res.status(200).json({
      message: "User basic info updated successfully",
      success: true,
      data:{updateUser}
    });
  };
}

export default new UserService();
