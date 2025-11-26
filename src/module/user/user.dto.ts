import { GENDER } from "../../utils";

export interface UpdateDTO {
    fullName?:string,
    phone?:string,
    gender?:GENDER,
}