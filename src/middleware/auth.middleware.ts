import { UserRepository } from "../DB";
import { NotFoundException } from "../utils";
import { verifyToken } from "../utils/token";
import { NextFunction, Request, Response } from "express";

export const isAuthenticated = ()=>{
    return async (req:Request, res:Response, next:NextFunction)=>{
    const token = req.headers.authorization;
    const payload = verifyToken(token);
    const userRepository = new UserRepository();
    const user = await userRepository.Exist({_id:payload._id})
    if(!user) throw new NotFoundException("User not found.")
    // implementation >> check token >> logout from all devices [credentials updated at]
    req.user = user
    next()
    }
}
