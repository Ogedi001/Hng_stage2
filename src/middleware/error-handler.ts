import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors";
import logger from "../Logger"
import { AxiosError } from "axios";



export const errorHandlerMiddleware = async (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    logger.error(err.serializeErrors());
    return res.status(err.statusCode).json({ errors: err.serializeErrors() });
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

  if (err instanceof AxiosError) {
    const axiosError = err as AxiosError;

    if (axiosError.response) {
      logger.error({
        message: "Axios error response",
        status: axiosError.response.status,
        data: axiosError.response.data,
      });
      return res.status(axiosError.response.status).json({
        errors: [
          {
            message: "Axios error response",
            details: axiosError.response.data,
          },
        ],
      });
    } else if (axiosError.request) {
      logger.error({
        message: "No response received from Axios request",
        request: axiosError.request,
      });
      return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({
        errors: [
          {
            message: "No response received from the external service.",
          },
        ],
      });
    } else {
      logger.error({
        message: "Error setting up Axios request",
        error: axiosError.message,
      });
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        errors: [
          {
            message:
              "An error occurred while setting up the request to the external service.",
            details: axiosError.message,
          },
        ],
      });
    }
  }
  // Other uncaught errors
   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    errors: [{ message: err.message }],
   });
};