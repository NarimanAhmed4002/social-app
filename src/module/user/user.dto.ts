import e from "express";
import { GENDER } from "../../utils";

export interface UpdateDTO {
    fullName?:string,
    phone?:string,
    gender?:GENDER,
}

export interface UpdateEmailDTO {
    email:string
}

export interface EmailAndOtpDTO {
    oldCode:string,
    newCode:string
}

export interface Verify2FADTO {
    otp:string
}