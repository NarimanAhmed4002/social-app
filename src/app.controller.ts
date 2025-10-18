import { NextFunction, Request, Response, type Express } from "express";
import { authRouter, userRouter, postRouter } from "./module";
import { connectdb } from "./DB";
import { AppError } from "./utils";
export function bootstrap (app: Express, express:any){
    // parsing raw data
    app.use(express.json())
    // connect DB
    connectdb()
    // auth
    app.use("/auth", authRouter)
    // user
    app.use("/user", userRouter)
    // message
    // comments
    // posts
    app.use("/post", postRouter)
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({
            message:"invalid router",
            success:false 
        })
    })

    // global error handler
    // MUST Error then req, res, next
    app.use((error:AppError , req:Request, res:Response, next:NextFunction)=>{
        return res.status(error.statusCode || 500).json({
            message:error.message,
            success:false,
            errDetails:error.errorDetails
        })
    })
};

// Sets up the Express app with middleware, routes, DB connection, and error handling.
// Central place to configure app components.
// Initializes routes for different modules (auth, user, etc.).
// Connects to the database when the app starts.
// Also includes a global error handler to catch and format errors consistently.
// Typically called from the main server file (e.g., server.ts).
// This acts like a global or root controller, possibly handling:
//     1-App health check routes (e.g., /api/health)
//     2-Global request logging.
//     3-Root-level API grouping.