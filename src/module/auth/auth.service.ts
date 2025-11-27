import { Request, Response } from "express";
import { LoginDTO, RegisterDTO, VerifyAccountDTO } from "./auth.dto";
import { BadRequestException, compareHash, ConflictException, ForbiddenException, generateHash, generateOTP, generateToken} from "../../utils";
import { UserRepository } from "../../DB";
import { AuthFactoryService } from "./factory";
import { authProvider } from "./Provider/auth.provider";
class authService {
    private userRepository = new UserRepository();
    private authFactoryService = new AuthFactoryService();
    constructor () {
        // this.register = this.register.bind(this) // to make "this" refer to the class not to the window
    }
        register = async (req:Request, res:Response) => {
        // get data from body
        const registerDTO:RegisterDTO = req.body;
        
        // check existence
        const userExist = await this.userRepository.Exist({email:registerDTO.email})
        
        if(userExist) {
            throw new ConflictException("User already exists")
        }
        // prepare data and convert it to user document : hashing - encryption - otp - translation
        const user = this.authFactoryService.register(registerDTO)
        // save into DB
        const createdUser = await this.userRepository.create(user)
        delete user.otp;
        delete user.otpExpireAt;
        // send response
        return res.status(201).json({
            message:"User created successfully.",
            success:true,
            data:{user}
            
        })
    };

    verifyAccount = async (req:Request, res:Response) => {
        // get data from req
        const verifyAccountDTO:VerifyAccountDTO = req.body;
        await authProvider.checkOTP(verifyAccountDTO);
        await authProvider.updateUser(
            {email:verifyAccountDTO.email},
            {isVerified:true, $unset:{otp:"", otpExpiryeAt:""}}
        );
        return res.sendStatus(204); 
    }

    login = async (req:Request, res:Response)=>{
        // get data from req
        const loginDTO:LoginDTO = req.body;
        // check existence
        const userExist = await this.userRepository.Exist({email:loginDTO.email})
        if(!userExist){throw new ForbiddenException("Invalid credintials.");
        };
        // compare password
        if(!await compareHash(loginDTO.password, userExist.password)){
            throw new ForbiddenException("Invalid credintials.");
        };

        if(userExist.is2FAEnabled){
                if( req.user?.twoFAOTPExpireAt && (req.user?.twoFAOTPExpireAt?.getTime() as number) > Date.now()){
                  throw new BadRequestException("OTP is not expired yet!")}
            
            const otp = generateOTP();
            await this.userRepository.update(
                {email:loginDTO.email},
                {$set:{
                    twoFAOTP: generateHash(otp.toString()), 
                    twoFAOTPExpireAt:new Date(Date.now()+10*60*1000)}} )// 10 minutes

        const accessToken = generateToken({
            payload:{_id:userExist._id, 
            role:userExist.role
            },
            options:{expiresIn:"1d"}
        });
        // send response
        return res.status(200).json({
            message:"User logged in successfully.",
            success:true,
            data:{accessToken}
        });
    };
};
};
export default new authService();

// Contains business logic — e.g., verifying passwords, creating JWT tokens.
// service functions do not have next parameter because they do not handle errors directly, 
// but middlewares must have it(next parameter) to pass errors to the next middleware.