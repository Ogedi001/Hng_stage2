import { Request, Response } from "express";
import {
  CommentInputData,
  createCommentService,
  getCommentByIdService,
  getPostByIdServive,
  LikeInputData,
  LikePostService,
  NotificationData,
  triggerNotification,
} from "../service";
import { BadRequestError } from "../errors";
import { notificationSocket } from "../app";
import { successResponse } from "../helpers";
import { StatusCodes } from "http-status-codes";
import { NotificationType } from "@prisma/client";

export const userCommentOnPostController = async (
  req: Request,
  res: Response
) => {
  const { content, postId } = req.body;
  const user = req.currentUser;

  const { post } = await getPostByIdServive(postId);
  if (!post) throw new BadRequestError("Invalid post ID");
  const data: CommentInputData = {
    content,
    postId,
    authorId: user?.id!,
  };
  const comment = await createCommentService(data);
  const notificationData: NotificationData = {
    type: NotificationType.COMMENT,
    senderId: user?.id!,
    postId,
    receiverId: post.author.id,
  };
  await triggerNotification(notificationData);
  notificationSocket.emit(`${post.author.id}:post:comment`, comment);

  return successResponse(res, StatusCodes.CREATED, comment);
};

export const userLikePostController = async (req: Request, res: Response) => {
  const { postId } = req.body;
  const user = req.currentUser;
  const data: LikeInputData = {
    postId,
    userId: user?.id!,
  };
  const { post } = await getPostByIdServive(postId);
  if (!post) throw new BadRequestError("Invalid post ID");

  const newLike = await LikePostService(data);
  const notificationData: NotificationData = {
    type: NotificationType.COMMENT,
    senderId: user?.id!,
    postId,
    receiverId: post.authorId,
  };
  await triggerNotification(notificationData);
  notificationSocket.emit(`${post.authorId}:post:like`);
  return successResponse(res, StatusCodes.CREATED, newLike);
};

export const userLikeCommentController = async (
  req: Request,
  res: Response
) => {
  const { postId, commentId } = req.body;
  const user = req.currentUser;
  const data: LikeInputData = {
    postId,
    commentId,
    userId: user?.id!,
  };
  const { post } = await getPostByIdServive(postId);
  if (!post) throw new BadRequestError("Invalid post ID");
  const comment = await getCommentByIdService(commentId)
  if (!comment) throw new BadRequestError("Invalid comment ID");
  const newLike = await LikePostService(data);
  const notificationData: NotificationData = {
    type: NotificationType.COMMENT,
    senderId: user?.id!,
    postId,
    receiverId: post.authorId,
  };
  await triggerNotification(notificationData);
  notificationSocket.emit(`${post.authorId}:comment:like`)
  if(commentId !== user?.id){
    notificationSocket.emit(`${comment.authorId}:comment:like`)
  }
  return successResponse(res, StatusCodes.CREATED, newLike);
};
