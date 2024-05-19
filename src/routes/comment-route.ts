import { Router } from "express";
import {userCommentOnPostController } from "../controller";
import { currentUserMiddleware, emailVerificationCheck, permissionCheck } from "../middleware";



const router = Router();

router.use(currentUserMiddleware,emailVerificationCheck,permissionCheck)

router.route('/').post(userCommentOnPostController)
export { router as commentRoute };
