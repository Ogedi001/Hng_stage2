import { Router } from "express";
import {
  followeNewUser,
  seePostFeeds,
  userCommentOnPostController,
} from "../controller";
import { currentUserMiddleware, emailVerificationCheck } from "../middleware";

const router = Router();

router.use(currentUserMiddleware, emailVerificationCheck);

router.route("/").post(userCommentOnPostController).get(seePostFeeds);
export { router as postRoute };
