import {email, z} from "zod"
import { EmailAndOtpDTO, UpdateDTO, UpdateEmailDTO } from "./user.dto"
import { GENDER } from "../../utils"
import { generalFields } from "../../middleware"

export const updateBasicInfoDTO = z.object <UpdateDTO>({
    fullName: z.string().min(3).max(30).optional() as unknown as string,
    // lastName: z.string().min(3).max(30).optional() as unknown as string,
    phone: z.string().optional().optional() as unknown as string,
    gender: z.enum(GENDER).optional() as unknown as GENDER
})

export const updateEmail = z.object <UpdateEmailDTO>({
    email: email({ error: "Invalid email"}) as unknown as string
})
// defines the properties of UpdateDTO(the data we expect to receive from user in body).
// Used to validate incoming request data (e.g., req.body) before processing.
// Ensures data integrity and provides clear error messages if validation fails.
// Validates inputs for updating user information.

export const emailAndOtp  = z.object <EmailAndOtpDTO>({
    oldCode :z.string().regex(/^\d{6}$/) as unknown as string,
    newCode :z.string().regex(/^\d{6}$/) as unknown as string,
})

export const verify2FA = {
    otp:z.string().length(5,"OTP must be 5 characters long") as unknown as string,
}