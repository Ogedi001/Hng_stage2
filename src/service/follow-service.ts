import { Follow } from "@prisma/client";
import { prisma } from "../client";

export interface FollowInputData {
  followerId:string
  followingId:string
}


export const fellowUserService = async (data: FollowInputData) => {
  const follow = prisma.follow.create({
    data: {
      ...data,
    },
  });
  return follow;
};

//@desc this get all followers of a user
export const getUserFollowers = async (query: any, userId: string) => {
  let page = parseInt(query.page || "1");
  let limit = parseInt(query.limit || "10");
  let startIndex = (page - 1) * limit;

  const followers = await prisma.follow.findMany({
    where: {
      followingId: userId,
    },
    select: {
      id: true,
      followingId: true,
      follower: true,
    },
    skip: startIndex,
    take: limit,
  });

  //@desc  getting total followers and pages for pagination
  const totalFollowers = await prisma.follow.count({
    where: { followingId: userId },
  });
  const totalPages = Math.ceil(totalFollowers / limit);
  return {
    pagination: {
      page,
      limit,
      totalPages,
      totalFollowers,
    },
    followers,
  };
};

//@desc this get all users, a user is following
export const getUserFollowings = async (query: any, userId: string) => {
  let page = parseInt(query.page || "1");
  let limit = parseInt(query.limit || "10");
  let startIndex = (page - 1) * limit;

  const following = await prisma.follow.findMany({
    where: {
      followerId: userId,
    },
    select: {
      id: true,
      followerId: true,
      following: true,
    },
    skip: startIndex,
    take: limit,
  });

  //@desc  getting total followers and pages for pagination
  const totalFollowers = await prisma.follow.count({
    where: { followerId: userId },
  });
  const totalPages = Math.ceil(totalFollowers / limit);
  return {
    pagination: {
      page,
      limit,
      totalPages,
      totalFollowers,
    },
    following,
  };
};
