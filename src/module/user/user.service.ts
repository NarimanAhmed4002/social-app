import { NextFunction, Request, Response } from "express";
import { UserRepository } from "../../DB";

class UserService {
    private readonly userRepository = new UserRepository(); 
    constructor() {}

    getProfile = async (req:Request, res:Response, next:NextFunction)=>{
    let user = await this.userRepository.getOne({_id:req.params.id})
    return res.status(200).json({
        message:"Done",
        success:true,
        data:{user: req.user}
    })
    }
}

export default new UserService();