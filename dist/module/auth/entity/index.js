"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
// this class is made to take instance from it 
class User {
    firstName; // ! means that it will be intialixed when i take an instance from this class
    lastName;
    fullName;
    email;
    password;
    dob;
    phone;
    credentialsUpdatedAt;
    role;
    gender;
    userAgent;
    otp;
    otpExpireAt;
    isVerified;
}
exports.User = User;
// Defines entities (class-like representations of DB objects, especially if using ORM).
// Example: User entity with properties like id, name, email, password.
// Used throughout the application to ensure consistent data structures.
// Helps in type-checking and IDE autocompletion.
// Acts as a blueprint for user data in the application.
