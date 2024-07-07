import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom-error";
import { ValidationError } from "express-validator";

export class RequestValidatorError extends CustomError {
  statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  constructor(private errors: ValidationError[]) {
    super("Invalid Request Parameters");
    //Set every offspring prototype to this prototype
    Object.setPrototypeOf(this, RequestValidatorError.prototype);
  }
  serializeErrors() {
    return this.errors.map((err:any) => {
      return {  field: err.path,message: err.msg };
    });
  }
}
