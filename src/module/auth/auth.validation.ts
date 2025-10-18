import {z} from "zod";
import { RegisterDTO } from "./auth.dto";
import { GENDER } from "../../utils";

// all fields are required except by defult from zod
// we can use .optional() to make it optional
// we can use .nullable() to make it nullable

export const registerSchema = z.object <RegisterDTO>({
    fullName: z.string().min(3).max(30) as unknown as string,
    email: z.email({ error: "Invalid email example@gmail.com expected." }) as unknown as string,
    password: z.string().min(8) as unknown as string,
    phone: z.string().optional() as unknown as string,
    gender: z.enum(GENDER) as unknown as GENDER
})

// defines the properties of RegisterDTO(the data we expect to receive from user in body).
// Used to validate incoming request data (e.g., req.body) before processing.
// Ensures data integrity and provides clear error messages if validation fails.
// Validates inputs for login/register.