"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
exports.userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        minLength: 3,
        maxLength: 30,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 30,
        trim: true,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent == "google")
                return false;
            return true;
        }
    },
    credentialsUpdatedAt: { type: Number },
    phone: { type: String },
    role: {
        type: String,
        enum: utils_1.SYS_ROLE,
        default: utils_1.SYS_ROLE.user
    },
    gender: {
        type: String,
        enum: utils_1.GENDER,
        default: utils_1.GENDER.female
    },
    userAgent: {
        type: String,
        enum: utils_1.USER_AGENT,
        default: utils_1.USER_AGENT.local
    },
    otp: { type: String },
    otpExpireAt: { type: Date },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }); // toObject is used to convert the mongoose object to JS Object which is used with findOne, findById, ...etc
exports.userSchema.virtual("fullName").get(function () {
    return this.firstName + " " + this.lastName;
}).set(function (value) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName;
    this.lastName = lName;
});
// to JSON to appear in response in postman
// to Object to appear in BE in other functions 
