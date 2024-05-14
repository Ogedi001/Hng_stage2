import { User, Token, RoleName, Role, ActivityLogType } from "@prisma/client";
import { prisma } from "../client";
import crypto from "crypto";
import { permissionData } from "../data/permissionSeed";
import { LogData } from "../interface/logs";

export type UserAccount = Partial<
  Pick<User, "resetPasswordExpires" | "resetPasswordToken" | "middlename">
> &
  Pick<User, "firstname" | "lastname" | "email" | "password" | "roleId">;

export type UserData = Partial<Pick<User, "password">> & Omit<User, "password">;

export interface UserRole {
  id?: string;
  name: string;
}

export type ReturnedUser = {
  role: UserRole;
} & UserData;

export type UserSettings = Pick<User, "firstname" | "lastname" | "middlename">;

export const createRole = async (name: RoleName): Promise<Role> => {
  const existingRole = await prisma.role.findFirst({ where: { name } });

  if (!existingRole) {
    return prisma.role.create({
      data: {
        name,
        permissions: {
          createMany: {
            data: permissionData(name),
          },
        },
      },
    });
  }
  return existingRole;
};

export const createUser = async (data: UserAccount): Promise<ReturnedUser> => {
  const user: ReturnedUser = await prisma.user.create({
    data: { ...data },
    include: {
      role: {
        select: {
          name: true,
        },
      },
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
