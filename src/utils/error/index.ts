export class AppError extends Error {
    constructor(
        message:string, 
        public statusCode: number, 
        public errorDetails?:Record<string, any>[] // object[] , {}[] : ways to write array of object
    ){
        super(message)
    }
}

export class ConflictException extends AppError {
    constructor(message:string, errorDetails?:Record<string, any>[]) {
        super(message, 409, errorDetails)
    }
}
export class NotFoundException extends AppError {
    constructor(message:string, errorDetails?:Record<string, any>[]) {
        super(message, 404, errorDetails)
    }
}
export class BadRequestException extends AppError {
    constructor(message:string, errorDetails?:Record<string, any>[]) {
        super(message, 400, errorDetails)
    }
}
export class UnAuthorizedException extends AppError {
    constructor(message:string, errorDetails?:Record<string, any>[]) {
        super(message, 401, errorDetails)
    }
};
export class ForbiddenException extends AppError {
    constructor(message:string, errorDetails?:Record<string, any>[]) {
        super(message, 403, errorDetails)
    }
};


// Custom error classes for consistent error handling across the app.
// custom error handling or error message formatting.