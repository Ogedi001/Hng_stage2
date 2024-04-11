import { Router } from "express";
import {userCommentOnPostController } from "../controller";
import { currentUserMiddleware, emailVerificationCheck } from "../middleware";



const router = Router();

router.use(currentUserMiddleware,emailVerificationCheck)

router.route('/').post(userCommentOnPostController)
export { router as commentRoute };
