import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = StatusCodes.NOT_FOUND;
    status ='Not found';
    constructor(message: string) {
        super(message)
        //Set every offspring prototype to this prototype
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
    serializeErrors() {
        return { status: this.status, message: this.message, statusCode: this.statusCode 
    }
}
}