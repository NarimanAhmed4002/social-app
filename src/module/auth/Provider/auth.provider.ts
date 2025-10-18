import { UserRepository } from "../../../DB";
import { VerifyAccountDTO } from "../auth.dto";
import { FilterQuery } from "mongoose";
import { IUser } from "../../../utils";
import { BadRequestException, NotFoundException } from "../../../utils";

export const authProvider = {
    async checkOTP(verifyAccountDTO: VerifyAccountDTO) {
        const userRepository = new UserRepository();
        // check if user exists
        const userExist = await userRepository.Exist(
            {email:verifyAccountDTO.email}
        );
        if(!userExist) 
            throw new NotFoundException("User not found"); // global
        // check otp
        if(userExist.otp !== verifyAccountDTO.otp) 
            throw new BadRequestException("Invalid OTP"); // global
        // check expiry at
        if(userExist.otpExpireAt < new Date()) 
            throw new BadRequestException("Expired OTP"); // global
    },

    async updateUser (filter: FilterQuery<IUser>, update:any) {
        const userRepository = new UserRepository();
        await userRepository.update(filter, update)
    }
};

