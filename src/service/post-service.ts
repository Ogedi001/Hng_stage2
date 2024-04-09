import { Media, Post, PostMedia } from "@prisma/client";
import { prisma } from "../client";
import { getUserFollowers } from "./follow-service";

export type PostInputData = Partial<Pick<Post, "content" | "tags">> &
  Pick<Post, "authorId">;
export type MediaInputData = Pick<Media, "url" | "type">;



export const createPost = async (data: PostInputData) => {
  const post = await prisma.post.create({
    data: { ...data },
  });

  return post;
};

export const createMedia = async (data: MediaInputData, postId: string) => {
  const media = await prisma.media.create({
    data: {
      ...data,
      postMedia: {
        create: {
          postId,
        },
      },
    },
    include: {
      postMedia: {
        select: {
          postId: true,
        },
      },
    },
  });

  return media;
};

export const getPersonalizedFeedService = async (
  query: any,
  userId: string
) => {
  let page = parseInt(query.page || "1");
  let limit = parseInt(query.limit || "10");
  let startIndex = (page - 1) * limit;

  const { followers } = await getUserFollowers(query, userId);

  const followedUserIds = followers.map((user) => user.followingId);

  if (followedUserIds.length === 0) {
    return [];
  }

  // Fetch posts from followed users with pagination
  const data = await prisma.post.findMany({
    where: {
      authorId: {
        in: followedUserIds,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: startIndex,
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      },
      likes: {
        select: {
          id: true,
          user: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
              email: true,
            },
          },
        },
      },
    },
  });

  const feed = data.map((post) => ({
    ...post,
    totalComments: post.comments.length,
    totalLikes: post.likes.length,
  }));

  // @desc get totalfeeds for pagination
  const totalFeeds = await prisma.post.count({
    where: {
      authorId: {
        in: followedUserIds,
      },
    },
  });

  const totalPages = Math.ceil(totalFeeds / limit);

  return {
    pagination: {
      page,
      limit,
      totalFeeds,
      totalPages,
    },
    feed,
  };
};


export const getPostByIdServive = async (id:string)=>{
    const post = await prisma.post.findUnique({where:{id},
        include: {
            author: {
              select: {
                id: true,
                firstname: true,
                lastname: true,
                email: true,
              },
            },
            comments: {
              select: {
                id: true,
                content: true,
                author: {
                  select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                  },
                },
              },
            },
            likes: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    firstname: true,
                    lastname: true,
                    email: true,
                  },
                },
              },
            },
          },
    })
    const totalPostComment = await prisma.comment.count({where:{postId:post?.id}})
    const  totalPostLikes = await prisma.like.count({where:{postId:post?.id}})

    return{
        totalPostLikes,
        totalPostComment,
        post
    }

}