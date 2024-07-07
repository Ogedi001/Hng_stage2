import { StatusCodes } from "http-status-codes";
import {
  generateJWT,
  Password,
  successResponse,
} from "../helpers";
import { Request, Response } from "express";
import { createUser, findUser } from "../service/auth-service";
import { BadRequestError } from "../errors";
import { OrganisationData } from "../interface";


//[POST] /auth/register
export const registerUserController = async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, phone, description } = req.body
  const userData = {
    firstname,
    lastname,
    email,
    password,
    phone
  }
  
  const orgData: OrganisationData = {
    name: `${firstname}'s Organisation`,
    description
  }
  try {
    const user = await createUser(userData, orgData)

    const accessToken = generateJWT({
      id: user.userId,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    })

    const data = { accessToken, user }

    return successResponse(res, StatusCodes.CREATED, "Registration successful", data);

  } catch (error) {
    throw new BadRequestError("Registration unsuccessful")
  }
};



//[POST] /auth/login
export const loginUserController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await findUser(email);

  if (!user) //throw new BadRequestError("User not found");
  throw new BadRequestError("Authentication failed")

  const passwordMatch = await Password.comparePassword(
    password,
    user?.password!
  );

  if (!passwordMatch)// throw new BadRequestError("Invalid credentials");
  throw new BadRequestError("Authentication failed")
  try {
    
  const accessToken = generateJWT({
    id: user.userId,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname
  })

  delete user.password

  const data = { accessToken, user }
  
  return successResponse(res, StatusCodes.OK, "Login successful", data
  );
  } catch (error) {
    throw new BadRequestError("Authentication failed")
  }

};

