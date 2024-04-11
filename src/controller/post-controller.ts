import { Request, Response } from "express";
import {
  createMedia,
  createPost,
  getPersonalizedFeedService,
  getUserFollowers,
  MediaInputData,
  NotificationData,
  PostInputData,
  triggerNotification,
} from "../service";
import { io } from "../app";
import { MediaType, NotificationType, Post } from "@prisma/client";
import { successResponse } from "../helpers";
import { StatusCodes } from "http-status-codes";

export const UserCreatePostController = async (req: Request, res: Response) => {
  const { content } = req.body as { content?: string };
  const user = req.currentUser;

  const postData: PostInputData = {
    authorId: user?.id!,
    content,
  };
  const post = await createPost(postData);
  const files = req.files as Express.Multer.File[];

  if (files && Object.keys(files).length > 0) {
    let type: MediaType;
    const mediaData = files.map((file) => {
      file.mimetype === "video/mp4"
        ? (type = MediaType.VIDEO)
        : (type = MediaType.IMAGE);
      const url: string = file.path;
      const mediaData: MediaInputData = {
        url,
        type,
      };
      return mediaData;
    });
    await createMedia(mediaData, post.id);
  }

  const { followers } = await getUserFollowers(req.query, user?.id!);

  for (const follower of followers) {
    const notificationData: NotificationData = {
      type: NotificationType.POST,
      senderId: user?.id!,
      postId: post.id,
      receiverId: follower.id,
    };
    await triggerNotification(notificationData);
  }

  io.to(user?.id!).emit("newPost", postData);

  return successResponse(res, StatusCodes.CREATED, post);
};

export const seePostFeeds = async (req: Request, res: Response) => {
  const userId = req.currentUser?.id!;
  const feeds = await getPersonalizedFeedService(req.query, userId);
  return successResponse(res, StatusCodes.CREATED, feeds);
};
