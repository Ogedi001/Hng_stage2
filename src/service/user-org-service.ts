import { prisma } from "../client";
import { OrganisationData } from "../interface";
import { UserData } from "./auth-service";



export const findUserByIdService = async (userId: string): Promise<UserData | null> => {
    return await prisma.user.findUnique({
      where: { userId },
    });
  };
  
  
  export const getUserOganisations_Service = async (userId: string) => {
    return await prisma.organisation.findMany({
      where: {
        users: {
          some: {
            userId
          }
        }
      },
    });
  };
  
  
  export const findOrganisationByIdService = async (orgId: string) => {
    return await prisma.organisation.findUnique({
      where: { orgId },
    });
  };
  
  export const createOrganisation_service = async (data: OrganisationData, userId: string) => {
    return await prisma.organisation.create({
      data: {
        ...data,
        users: {
          connect: {
            userId
          }
        }
      }
    })
  }
  
  
  export const getUserOganisation = async (orgId: string, userId: string) => {
    return await prisma.organisation.findFirst({
      where: {
        orgId,
        users: {
          some: {
            userId
          }
        }
      }
    })
  }
  
  
  
  export const addUserToOrganisation_service = async (orgId: string, userId: string) => {
    return await prisma.organisation.update({
      where:{orgId},
      data:{
        users:{
          connect:{userId}
        }
      }
  })
  }
  
  
  