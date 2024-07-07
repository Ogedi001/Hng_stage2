/// <reference path="../typings/index.d.ts" />
import { Request, Response, NextFunction, RequestHandler } from "express";
import { Userpayload, verifyJwtToken } from "../helpers";
import Logger from "../utils/logger";
import { UnauthorizedError } from "../errors";

const AUTH_HEADER_PREFIX = "Bearer";
let token: any;
export const currentUserMiddleware: RequestHandler  = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith(AUTH_HEADER_PREFIX)) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    throw new UnauthorizedError("User Not Logged In")
  }

  try {
    const payload = verifyJwtToken(token) as Userpayload;
    req.currentUser = payload;
    next();
  } catch (error) {
    Logger.info("Token Verification Error: ", error);
    throw new UnauthorizedError("User Not Logged In")
  }
};

