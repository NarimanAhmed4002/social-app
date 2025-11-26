import {z} from "zod"
import { UpdateDTO } from "./user.dto"
import { GENDER } from "../../utils"

export const updateBasicInfoDTO = z.object <UpdateDTO>({
    fullName: z.string().min(3).max(30).optional() as unknown as string,
    // lastName: z.string().min(3).max(30).optional() as unknown as string,
    phone: z.string().optional().optional() as unknown as string,
    gender: z.enum(GENDER).optional() as unknown as GENDER
})