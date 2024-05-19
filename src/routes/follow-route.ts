import { Router } from "express";
import { followeNewUser } from "../controller";
import { currentUserMiddleware, emailVerificationCheck, permissionCheck } from "../middleware";



const router = Router();

router.use(currentUserMiddleware,emailVerificationCheck,permissionCheck)

router.route('/:followingId').post(followeNewUser)
export { router as followRoute };
