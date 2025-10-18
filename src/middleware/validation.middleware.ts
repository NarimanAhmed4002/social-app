import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";
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