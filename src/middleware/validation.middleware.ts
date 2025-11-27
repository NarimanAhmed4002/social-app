import { NextFunction, Request, Response } from "express";
import z, { ZodType } from "zod";
import { BadRequestException } from "../utils";

export const isValid = (schema:ZodType)=>{
    return (req:Request, res:Response, next:NextFunction)=>{
        // validation
                // validate body
                let data = {...req.body, ...req.params, ...req.query}
                const result = schema.safeParse(data)
                console.log(result);
                if(result.success === false) {
                    let errMessages = result.error.issues.map((issues)=>({
                        path: issues.path[0] as string,
                        message:issues.message
                    }))
                    console.log(errMessages);
                    throw new BadRequestException("validation failed", errMessages)
                }
                return next();
    }
    
};


// checks request data before it hits controllers.
/**
 * Middleware helps manage tasks like:

    1- Authentication (verify tokens).
    2- Validation (check request inputs).
    3- Logging, CORS, etc.

* They run before controllers to filter or modify requests.
 */
export const generalFields = z.object({
    email: z.email(),
    password: z.string().min(8).max(50),
    otp: z.string().length(5),
    phoneNumber: z.string().length(11),
    name: z.string().min(3).max(50),
    dob: z.date(),
    confirmPassword: z.string().min(8).max(50),
    objectId: z.string().regex(/^[0-9a-fA-F]{24}$/), // أفضل من hex().length(24)
    headers: z.object({
        authorization: z.string().min(1, "token is required!"),
        accept: z.string().optional(),
        host: z.string().optional(),
        "accept-encoding": z.string().optional(),
        "content-type": z.string().optional(),
        "user-agent": z.string().optional(),
        "cache-control": z.string().optional(), // صححت spelling
        "postman-token": z.string().optional(),
        "content-length": z.string().optional(),
        connection: z.string().optional(),
    })
});
