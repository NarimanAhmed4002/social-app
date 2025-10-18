import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils";
// this class is made to take instance from it 
export class User {
    public firstName:string; // ! means that it will be intialixed when i take an instance from this class
    public lastName:string;
    public fullName:string;
    public email:string;
    public password:string;
    public dob:Date;
    public phone:string;
    public credentialsUpdatedAt:number;
    public role:SYS_ROLE;
    public gender:GENDER;
    public userAgent:USER_AGENT;
    public otp?:string;
    public otpExpireAt?:Date;
    public isVerified:boolean
}

// Defines entities (class-like representations of DB objects, especially if using ORM).
// Example: User entity with properties like id, name, email, password.
// Used throughout the application to ensure consistent data structures.
// Helps in type-checking and IDE autocompletion.
// Acts as a blueprint for user data in the application.
