import { Router } from "express";
import { userLikeCommentController, userLikePostController } from "../controller";
import { currentUserMiddleware, emailVerificationCheck, permissionCheck } from "../middleware";



const router = Router();

router.use(currentUserMiddleware,emailVerificationCheck,permissionCheck)

router.route('/comment').post(userLikeCommentController)
router.route('/post').post(userLikePostController)
export { router as likeRoute };
