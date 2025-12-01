import { Schema } from "mongoose";
import { IUser } from "../../../utils";
import { GENDER, SYS_ROLE, USER_AGENT } from "../../../utils";
import { sendMail } from "../../../utils";

export const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 30,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        if (this.userAgent == USER_AGENT.google) return false;
        return true;
      },
    },
    credentialsUpdatedAt: { type: Number },
    phone: { type: String },
    role: {
      type: Number,
      enum: SYS_ROLE,
      default: SYS_ROLE.user,
    },
    gender: {
      type: Number,
      enum: GENDER,
      default: GENDER.female,
    },
    userAgent: {
      type: Number,
      enum: USER_AGENT,
      default: USER_AGENT.local,
    },
    otp: { type: String },
    otpExpireAt: { type: Date },
    isVerified: { type: Boolean, default: false },
    // update email
    otpOldEmail: { type: String },
    otpNewEmail: { type: String },
    tempEmail: { type: String },

    // 2FA
    is2FAEnabled: { type: Boolean },
    twoFAOTP: { type: String },
    twoFAOTPExpireAt: { type: Date },

    // friend
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blockedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
); // toObject is used to convert the mongoose object to JS Object which is used with findOne, findById, ...etc

userSchema
  .virtual("fullName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (value: string) {
    const [fName, lName] = value.split(" ");
    this.firstName = fName as string;
    this.lastName = lName as string;
  });
// Defines the structure of the user document/table, often using Mongoose or an ORM.
// Example: fields like name, email, password, with validation rules.
// to JSON to appear in response in postman : to appear virtuals in json response
// to Object to appear in BE in other functions

userSchema.pre("save", async function (next) {
  if (this.userAgent != USER_AGENT.google && this.isNew == true)
    await sendMail({
      to: this.email, // this refers to the document being saved
      subject: "Confirm your email.",
      html: `<h1>Your OTP is ${this.otp}.</h1>`,
    });
});
