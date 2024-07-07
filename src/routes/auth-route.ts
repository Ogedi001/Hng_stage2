import { Router } from "express";
import {  loginUserController, registerUserController } from "../controller/auth-controller";
import { loginUserSchema, registerUserSchema } from "../schema/auth-schema";
import { validateRequestMiddleware } from "../middleware";


const router =  Router()

router.route("/register").post(registerUserSchema(),validateRequestMiddleware,registerUserController)
 
router.route("/login").post(loginUserSchema(),validateRequestMiddleware,loginUserController)

export { router as authUserRoute };