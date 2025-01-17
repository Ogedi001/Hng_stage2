import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError, RequestValidatorError } from "../errors";

import Logger from "../utils/logger";



export const errorHandlerMiddleware = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if(err instanceof RequestValidatorError){
    Logger.error(err.serializeErrors());
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
  }

  if (err instanceof CustomError) {
    
    Logger.error(err.serializeErrors());
    const error = err.serializeErrors()
    return res.status(err.statusCode).json({...error });
  }

  // Prisma related errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
     if (err.code === "P2002"){
     const fieldNames = err.meta?.target;
     res.status(StatusCodes.BAD_REQUEST).json({message:`Unique constraint failed on the fields: (${fieldNames})
     please provide a different data for this fields: (${fieldNames})`})
    }

   if (err.code === "P2025")
   {
    res.status(StatusCodes.BAD_REQUEST).json({message:err.meta?.cause})}
   
     return res
       .status(StatusCodes.BAD_REQUEST)
      .json({ errors: [{ message: "Something went wrong" }] });
  }

  
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(StatusCodes.BAD_REQUEST).json({message:`please fill required fields correctly
    ${err.message}`});
  }
  if (err instanceof Prisma.PrismaClientInitializationError) {
    res.status(StatusCodes.BAD_REQUEST).json({message:`errorCode: ${err.errorCode}
    errorName: ${err.name}
    ${err.message}`});
  }

  // Other uncaught errors
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    errors: [{ message: err.message }],
   });
};