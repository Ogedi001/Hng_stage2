import { StatusCodes } from "http-status-codes";
import {
  blacklistJWTtoken,
  generateJWT,
  Password,
  sendEmailVerificationLinkEmail,
  sendResetPasswordEmail,
  successResponse,
} from "../helpers";
import { NextFunction, Request, Response } from "express";
import {
  createLog,
  createUser,
  findTokenService,
  findUser,
  findUserByIdService,
  findUserByResetPasswordToken,
  getUserResetPasswordTokenService,
  updatePassword,
  updateUser_service,
  verifyUserEmailService,
} from "../service/auth-user-service";
import { BadRequestError } from "../errors";
import { ActivityLogType, RoleName } from "@prisma/client";
import { createRole } from "../service/role-permisions-service";
import { getUserLocationInfo } from "../helpers/location";

export const registerUserController = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, comfirmPassword } = req.body;
  if (password !== comfirmPassword)
    throw new BadRequestError("Password do not Match");
  const role = await createRole(RoleName.USER);
  const data = await createUser({
    firstname,
    lastname,
    email,
    password,
    roleId: role.id,
  });

  await sendEmailVerificationLinkEmail({
    userId: data.id,
    email: data.email,
    username: `${firstname} ${lastname}`,
  });

  return successResponse(res, StatusCodes.CREATED, data);
};

export const verifyEmailController = async (req: Request, res: Response) => {
  const { userId, token } = req.params;

  const user = await findUserByIdService(userId.trim());

  if (!user) throw new BadRequestError("Invalid user id");

  const tokenData = await findTokenService(token.trim());

  if (!tokenData) throw new BadRequestError("Invalid user token");

  await verifyUserEmailService(tokenData.userId);

  return successResponse(res, StatusCodes.OK, {
    message: "Email verification successful",
  });
};

export const resendEmailVerificationLink = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  const user = await findUser(email);

  if (!user) throw new BadRequestError("Invalid email");

  await sendEmailVerificationLinkEmail({
    userId: user.id,
    email: user.email,
    username: `${user.firstname} ${user.lastname}`,
  });

  return successResponse(res, StatusCodes.OK, {
    message: "Email verification link resent",
  });
};

export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUser(email);

  if (!user) throw new BadRequestError("User not found");

  if (!user.isEmailVerified) {
    await sendEmailVerificationLinkEmail({
      userId: user.id,
      email: user.email,
      username: `${user.firstname} ${user.lastname}`,
    });
    throw new BadRequestError(
      "Account not verified!🙁 Verification link has been resent to your mail"
    );
  }

  if (!user.isEnabled) {
    throw new BadRequestError("Account disabled!🙁 Visit our support group");
  }
  const passwordMatch = await Password.comparePassword(
    password,
    user?.password!
  );

  if (!passwordMatch) throw new BadRequestError("Invalid credentials");

  const userJWT = generateJWT({
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    isEmailVerified: true,
    role: {
      roleId: user.roleId,
      name: user.role.name,
    },
  });
  const updatedUser = await updateUser_service(user.id, { isLoggedIn: true });
  delete updatedUser.password;

  const locationInfo = await getUserLocationInfo(req.body.ipAddress);
  const location = `${locationInfo.country_name} ${locationInfo.state_prov} ${locationInfo.district} ${locationInfo.city}`;
  const zipCode = locationInfo.zipcode;
  const timeZone_gmt_offset = locationInfo.time_zone.name;
  locationInfo.time_zone.offset;

  
  await createLog({
    logType: ActivityLogType.LOGIN,
    userId: user.id,
    location,
    timeZone_gmt_offset,
    zipCode,
  });
  return successResponse(res, StatusCodes.OK, {
    updatedUser,
    token: userJWT,
  });
};

export const logOutController = async (req: Request, res: Response) => {
  const user = req.currentUser!
  const token = req.headers.authorization!.split(" ")[1];
  await blacklistJWTtoken(token);

  const locationInfo = await getUserLocationInfo(req.body.ipAddress);
  const location = `${locationInfo.country_name} ${locationInfo.state_prov} ${locationInfo.district} ${locationInfo.city}`;
  const zipCode = locationInfo.zipcode;
  const timeZone_gmt_offset = locationInfo.time_zone.name;
  locationInfo.time_zone.offset;

  await createLog({
    logType: ActivityLogType.LOGOUT,
    userId: user.id,
    location,
    timeZone_gmt_offset,
    zipCode,
  });

  return successResponse(res, StatusCodes.OK, {
    message: "Logged out successfully",
  });
};

export const userUpdatePasswordController = async (
  req: Request,
  res: Response
) => {
  const email = req.currentUser?.email;
  const { oldPassword, newPassword } = req.body;

  if (!email) throw new BadRequestError("Invalid email");

  const user = await findUser(email);
  if (!user) throw new BadRequestError("Invalid credentials");

  const passwordMatch = await Password.comparePassword(
    oldPassword,
    user?.password!
  );
  if (!passwordMatch) throw new BadRequestError("Invalid credentials");

  await updatePassword(email, newPassword);

  const token = req.headers.authorization!.split(" ")[1];
  await blacklistJWTtoken(token);

  const userJWT = generateJWT({
    id: user.id,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    isEmailVerified: user.isEmailVerified,
    role: {
      roleId: user.roleId,
      name: user.role.name,
    },
  });

  // remove password from the user object
  delete user.password;

  return successResponse(res, StatusCodes.CREATED, {
    message: "password updated",
    token: userJWT,
  });
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;

  const user = await findUser(email);

  if (!user) throw new BadRequestError("User not found");

  try {
    await sendResetPasswordEmail({ email: user.email });

    return successResponse(res, StatusCodes.OK, {
      message: "password reset email sent",
    });
  } catch (error) {
    await getUserResetPasswordTokenService(user.email, true);
    return next(error);
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const { resetToken } = req.params;
  const { password, comfirmPassword } = req.body;

  if (password === comfirmPassword)
    throw new BadRequestError("Password do not Match");

  const user = await findUserByResetPasswordToken(resetToken);

  if (!user) throw new BadRequestError("Invalid reset token");

  await updatePassword(user.email, password);
  await getUserResetPasswordTokenService(user.email, true);

  return successResponse(res, StatusCodes.CREATED, {
    message: "password reset",
  });
};
