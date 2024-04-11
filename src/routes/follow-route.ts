import { Router } from "express";
import { followeNewUser } from "../controller";
import { currentUserMiddleware, emailVerificationCheck } from "../middleware";



const router = Router();

router.use(currentUserMiddleware,emailVerificationCheck)

router.route('/:followingId').post(followeNewUser)
export { router as followRoute };
