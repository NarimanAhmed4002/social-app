import { SYS_ROLE, USER_AGENT } from "../../../utils";
import { generateHash } from "../../../utils";
import { generateExpiryDate, generateOTP } from "../../../utils";
import { RegisterDTO } from "../auth.dto";
import { User } from "../entity";

export class AuthFactoryService {
    // registerDTO : data from request body(values)
    register(registerDTO:RegisterDTO) {
        const user = new User(); // instance of User model to assign values to it
        user.fullName = registerDTO.fullName;
        user.email = registerDTO.email;
        user.password = generateHash(registerDTO.password); // assign hashed password to the password field
        user.phone = registerDTO.phone as string;
        user.otp = generateOTP();
        user.otpExpireAt = generateExpiryDate(15 * 60 * 1000); 
        user.credentialsUpdatedAt = Date.now( );
        user.role = SYS_ROLE.user;
        user.gender = registerDTO.gender;
        user.userAgent = USER_AGENT.local;
        user.isVerified = false;
        return user; // return the user document with all fields assigned to save it later in DB
    }
};
        
// prepare data and convert it to user document : hashing - encryption - otp - translation
// Creates service or controller instances — useful for dependency injection 
// (helps manage app components cleanly).
