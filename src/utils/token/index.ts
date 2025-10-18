import { devConfig } from "../../config/env/dev.config";
import jwt,{JwtPayload, SignOptions} from "jsonwebtoken";

export const generateToken = (
    {payload,secretKey = devConfig.SECRET_KEY as string, options} // named parameters & their default values
    :{payload:object, secretKey?:string, options?:SignOptions})=>{ // the type of the named parameters
       return jwt.sign(payload, secretKey, options)
}

export const verifyToken = (token:string, secretKey:string = devConfig.SECRET_KEY as string)=>{
    return jwt.verify(token, secretKey) as JwtPayload;
}