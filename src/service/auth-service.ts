import { User } from "@prisma/client";
import { prisma } from "../client";
import { OrganisationData } from "../interface";


export type UserAccount = Pick<User, "firstname" | "lastname" | "email" | "password" | 'phone'>;

export type UserData = Partial<Pick<User, "password">> & Omit<User, "password">;



export const createUser = async (data: UserAccount, org: OrganisationData) => {
  const user: UserData = await prisma.user.create({
    data: {
      ...data,
      organisations: {
        create: {
          ...org
        }
      }
    }

  })
  return user
};


export const findUser = async (email: string): Promise<UserData | null> => {
  const user = await prisma.user.findUnique({
    where: { email }
  })
  return user
};

