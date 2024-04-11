import { Comment } from "@prisma/client";
import { prisma } from "../client";

export type CommentInputData = Pick<Comment, "content" | "authorId" | "postId">;

export interface LikeInputData {
  commentId?: string;
  postId: string;
  userId: string;
}

export const createCommentService = async (data: CommentInputData) => {
  return await prisma.$transaction([
    prisma.comment.create({
      data: { ...data },
    }),
    // Update post's comment count
    prisma.post.update({
      where: { id: data.postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    }),
  ]);
};

export const LikeCommentService = async (data: LikeInputData) => {
  return await prisma.$transaction([
    prisma.like.create({
      data: {
        ...data,
      },
    }),
    prisma.comment.update({
      where: { id: data.commentId! },
      data: {
        likeCount: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    }),
  ]);
};

export const LikePostService = async (data: LikeInputData) => {
  return await prisma.$transaction([
    prisma.like.create({
      data: {
        ...data,
      },
    }),
    prisma.post.update({
      where: { id: data.postId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            email: true,
          },
        },
      },
    }),
  ]);
};

export const getCommentByIdService = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
    },
  });
};
