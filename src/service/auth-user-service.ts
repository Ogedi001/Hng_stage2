import { User, Token} from "@prisma/client";
import { prisma } from "../client";
import crypto from "crypto";

import { LogData, UserPermissions,UserRole, UserUpdateData } from "../interface";
import { permissionData } from "../data/permissionSeed";
import { name } from "ejs";

export type UserAccount = Partial<
  Pick<User, "resetPasswordExpires" | "resetPasswordToken" | "middlename">
> &
  Pick<User, "firstname" | "lastname" | "email" | "password" | "roleId">;

export type UserData = Partial<Pick<User, "password">> & Omit<User, "password">;



export type ReturnedUser = {
  role: UserRole;
  permissions:UserPermissions[]
} & UserData;

export type UserSettings = Pick<User, "firstname" | "lastname" | "middlename">;


export const createUser = async (data: UserAccount) => {
  const permissions =permissionData(name).map(permission=>({...permission,roleId:data.roleId}))

  const user:ReturnedUser = await prisma.user.create({
    data: { ...data,
      permissions:{
        createMany:{
          data:permissions
        }
      }
     },
    include: {
      role: {
        select: {
          name: true,
        },
      },
      permissions:{
        select:{
          name:true,
          can_read:true,
          can_write:true,
          can_delete:true
        }
      }
    },
  });

  delete user.password;

  return user;
};

export const createLog = async (data: LogData) => {
  const { userId, logType } = data;

  const auditLogData = {
    userId,
    logType,
  };

  const auditLogWhere = {
    userId_logType: {
      userId,
      logType,
    },
  };

  let userLog: any;

  const createdata = {
    create: {
      location: data.location!,
      zipCode: data.zipCode!,
      timeZone_name: data.timeZone_name!,
      timeZone_gmt_offset: data.timeZone_gmt_offset!,
    },
  };
  switch (logType) {
    case "LOGIN":
      userLog = await prisma.logIn_Log.create({
        data: {
          ...createdata.create,
          auditLog: {
            connectOrCreate: {
              where: auditLogWhere,
              create: auditLogData,
            },
          },
        },
      });
      break;
    case "LOGOUT":
      userLog = await prisma.logout_Log.create({
        data: {
          ...createdata.create,
          auditLog: {
            connectOrCreate: {
              where: auditLogWhere,
              create: auditLogData,
            },
          },
        },
      });
      break;
    case "ROLE_ASSIGNMENT":
      userLog = await prisma.roleChange_Log.create({
        data: {
          newRole: data.newRole!,
          preRole: data.preRole!,
          description: data.description!,
          auditLog: {
            connectOrCreate: {
              where: auditLogWhere,
              create: auditLogData,
            },
          },
        },
      });
      break;
    case "PERMISSION_CHANGE":
      userLog = await prisma.permissionChange_Log.create({
        data: {
          description: data.description!,
          permissionName: data.permissionName!,
          ...data.permissionBols,
          auditLog: {
            connectOrCreate: {
              where: auditLogWhere,
              create: auditLogData,
            },
          },
        },
      });
      break;
    default:
      throw new Error(`Unsupported log type: ${logType}`);
  }

  return userLog;
};


export const findUser = async (email: string): Promise<ReturnedUser | null> => {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      role: {
        select: {
          name: true,
        },
      },
      permissions:{
        select:{
          name:true,
          can_read:true,
          can_write:true,
          can_delete:true
        }
      }
    },
  });
};

export const getUserResetPasswordTokenService = async (
  email: string,
  nullify: boolean
): Promise<string | null> => {
  if (nullify) {
    await prisma.user.update({
      where: { email },
      data: {
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return null;
  }

  // set to expire in 10 mins
  const currentDate = String(Date.now() + 10 * 60 * 1000);
  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await prisma.user.update({
    where: { email },
    data: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: currentDate,
    },
  });

  return resetToken;
};

export const findUserByResetPasswordToken = async (
  resetToken: string
): Promise<User | null> => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken.trim())
    .digest("hex");

  const user = await prisma.user.findUnique({
    where: { resetPasswordToken },
  });

  if (!user) return null;

  if (user.resetPasswordExpires && +user.resetPasswordExpires < Date.now())
    return null;

  return user;
};

export const findUserByIdService = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: true,
    },
  });
};

export const updatePassword = async (email: string, password: string) => {
  const user = await prisma.user.update({
    where: { email },
    data: { password },
  });
  return user;
};

export const updateUser_service= async(id:string,updateData:UserUpdateData):Promise<ReturnedUser>=>{
  const data: Partial<UserUpdateData> = {};
  if (updateData.firstname !== undefined) data.firstname = updateData.firstname;
  if (updateData.lastname !== undefined) data.lastname = updateData.lastname;
  if (updateData.middlename !== undefined) data.middlename = updateData.middlename;
  if (updateData.isLoggedIn !== undefined) data.isLoggedIn = updateData.isLoggedIn;
  if (updateData.isEnabled !== undefined) data.isEnabled = updateData.isEnabled;
  if (updateData.roleId !== undefined) data.roleId = updateData.roleId;

  const user:ReturnedUser = await prisma.user.update({where:{id},data,
    include: {
      role: {
        select: {
          name: true,
        },
      },
      permissions:{
        select:{
          name:true,
          can_read:true,
          can_write:true,
          can_delete:true
        }
      }
    },
  })
return user
}

export const createUserTokenService = async (
  userId: string,
  token: string
): Promise<Token> => {
  // Token set to expire in one hour
  const currentDate = String(Date.now() + 60 * 60 * 1000);
  return await prisma.token.create({
    data: {
      User: { connect: { id: userId } },
      token,
      expiresAt: currentDate,
    },
  });
};

export const findTokenService = async (
  token: string
): Promise<Token | null> => {
  const tokenData = await prisma.token.findUnique({ where: { token } });

  if (!tokenData) return null;

  if (+tokenData.expiresAt < Date.now()) return null;

  return tokenData;
};

export const verifyUserEmailService = async (id: string): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data: { isEmailVerified: true },
  });
};



  