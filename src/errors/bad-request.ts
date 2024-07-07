import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";


export class BadRequestError extends CustomError {
    statusCode = StatusCodes.BAD_REQUEST;
    status = "Bad request";

    constructor(message: string) {
        super(message);
        // Set every offspring prototype to THIS prototype
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }

    serializeErrors() {
        return { status: this.status, message: this.message, statusCode: this.statusCode 
    }
}
}