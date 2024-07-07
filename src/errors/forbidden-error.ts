import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class ForbiddenError extends CustomError {
    statusCode = StatusCodes.FORBIDDEN;
    status= 'Forbidden';
    constructor(message?:string) {
        const errMsg  = message?message:'Forbidden'
        super(errMsg)
        //Set every offspring prototype to this prototype
        Object.setPrototypeOf(this, ForbiddenError.prototype)
    }
    serializeErrors() {
        return { status: this.status, message: this.message, statusCode: this.statusCode 
    }
}
}