import { GENDER } from "../../utils";

export interface UpdateDTO {
    firstName?:string, 
    lastName?:string,
    phone?:string,
    gender?:GENDER,
}