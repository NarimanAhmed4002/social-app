"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const utils_1 = require("../../../utils");
const utils_2 = require("../../../utils");
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
            if (this.userAgent == utils_1.USER_AGENT.google)
                return false;
            return true;
        }
    },
    credentialsUpdatedAt: { type: Number },
    phone: { type: String },
    role: {
        type: Number,
        enum: utils_1.SYS_ROLE,
        default: utils_1.SYS_ROLE.user
    },
    gender: {
        type: Number,
        enum: utils_1.GENDER,
        default: utils_1.GENDER.female
    },
    userAgent: {
        type: Number,
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
// Defines the structure of the user document/table, often using Mongoose or an ORM.
// Example: fields like name, email, password, with validation rules.
// to JSON to appear in response in postman : to appear virtuals in json response
// to Object to appear in BE in other functions 
exports.userSchema.pre("save", async function (next) {
    if (this.userAgent != utils_1.USER_AGENT.google && this.isNew == true)
        await (0, utils_2.sendEmail)({
            to: this.email, // this refers to the document being saved
            subject: "Confirm your email.",
            html: `<h1>Your OTP is ${this.otp}.</h1>`
        });
});
