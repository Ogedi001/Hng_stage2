import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class UnauthorizedError extends CustomError {
    statusCode = StatusCodes.UNAUTHORIZED;
    status = "unauthorized";
    constructor(message?: string) {
        const errMsg = message?message:'Not Authorized'
        super(errMsg)
        //Set every offspring prototype to this prototype
        Object.setPrototypeOf(this, UnauthorizedError.prototype)
    }
    serializeErrors() {
        return { status: this.status, message: this.message, statusCode: this.statusCode 
    }
}
}
