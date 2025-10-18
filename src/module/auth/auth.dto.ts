import { GENDER } from "../../utils";

// DTO: Data to object
export interface RegisterDTO {
    fullName:string,
    email:string,
    password:string,
    phone?:string,
    gender:GENDER,
}

export interface VerifyAccountDTO {
    email:string;
    otp:string;
}

export interface LoginDTO {
    email:string;
    password:string;
}

// defines what data we expect to receive from user in body
// Data Transfer Object; defines the expected shape of data in requests/responses (e.g., { email: string; password: string }).