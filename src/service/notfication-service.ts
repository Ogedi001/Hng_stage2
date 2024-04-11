import { NotificationType } from "@prisma/client";
import { prisma } from "../client";



export interface NotificationData {
    type: NotificationType;
    senderId: string;
    receiverId: string;
    postId?: string;
    commentId?: string;
    read?: boolean;
  }


export const triggerNotification = async (
  data:NotificationData
) => {
  return await prisma.notification.create({
    data:{...data}
  });
};

// Service to retrieve notifications for a user
export const getNotificationsForUser = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      receiverId: userId,
      read: false,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });


  return notifications;
};

export const updateNotificationsForUser =async (userId: string) => {
    const notifications = await prisma.notification.updateMany({
        where: {
          receiverId: userId,
          read: false,
        },
        data: {
          read: true,
        },
      });
    
      return notifications;
}


// Real-time notifications can be implemented using websockets or push notifications
// Depending on your application architecture and requirements
// You can use libraries like Socket.IO for websockets or Firebase Cloud Messaging for push notifications
