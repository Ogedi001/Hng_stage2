import { Router } from "express";
import {
  followeNewUser,
  seePostFeeds,
  userCommentOnPostController,
} from "../controller";
import { currentUserMiddleware, emailVerificationCheck, permissionCheck } from "../middleware";

const router = Router();

router.use(currentUserMiddleware, emailVerificationCheck,permissionCheck);

router.route("/").post(userCommentOnPostController).get(seePostFeeds);
export { router as postRoute };
