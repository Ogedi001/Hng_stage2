import {Request, Response } from "express";
import {
  fellowUserService,
  findUserByIdService,
  FollowInputData,
} from "../service";
import { BadRequestError } from "../errors";
import { successResponse } from "../helpers";
import { StatusCodes } from "http-status-codes";

import {notificationSocket} from "../app";


export const followeNewUser = async (req: Request, res: Response) => {
  const { followingId } = req.params;

  const data: FollowInputData = {
    followingId:followingId.trim(),
    followerId: req.currentUser?.id!,
  };
  const user = await findUserByIdService(followingId);
  if (!user) throw new BadRequestError("invalid user ID");

  const alreadyFollowed = user.followers.some(
    (follower) => follower.id === req.currentUser?.id!
  );
  if (alreadyFollowed)
    throw new BadRequestError("You are already following this user");


  await fellowUserService(data); 
    
  notificationSocket.join(followingId);

  return successResponse(res,StatusCodes.OK, "User followed successfully")
};
