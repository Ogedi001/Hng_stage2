import { Router } from "express";
import { followRoute } from "./follow-route";
import { authUserRoute } from "./auth-user-route";
import { postRoute } from "./post-route";
import { commentRoute } from "./comment-route";
import { likeRoute } from "./like-route";

const router = Router()

router.use('/follow', followRoute)
router.use('/auth',authUserRoute)
router.use('/post',postRoute)
router.use('/comment',commentRoute)
router.use('/comment',likeRoute)
export {router as applicationRoutes}