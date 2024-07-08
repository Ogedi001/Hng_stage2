import { NextFunction, Request, Response } from "express";
import { addUserToOrganisation_service, createOrganisation_service, findOrganisationByIdService, findUserByIdService, getUserOganisation, getUserOganisations_Service } from "../service/user-org-service";
import { StatusCodes } from "http-status-codes";
import { successResponse } from "../helpers";
import { OrganisationData } from "../interface";
import { BadRequestError } from "../errors";



// [GET] /api/users/:id
export const getUser_Controller = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await findUserByIdService(id);
    if (user) {
        delete user.password;
    }
    return successResponse(res, StatusCodes.OK, "User found", user);
};


//[GET] /api/organisations
export const getUserOrganisations = async (req: Request, res: Response) => {
    const userId = req.currentUser?.id!
    const organisations = await getUserOganisations_Service(userId)
    return successResponse(res, StatusCodes.OK, "Users organisations retrieve successfully", organisations)
}


//[GET] /api/organisations/:orgId
export const getOrganisationById = async (req: Request, res: Response) => {
    const { orgId } = req.params
    const organisation = await findOrganisationByIdService(orgId)

    return successResponse(res, StatusCodes.OK, "User organisation retrive successfully", organisation)
}

//[POST] /api/organisations
export const createOrganisation = async (req: Request, res: Response) => {
    const { name, description } = req.body
    const userId = req.currentUser?.id!
    const orgData: OrganisationData = { name, description }
    try {
        const organisation = await createOrganisation_service(orgData, userId)
        return successResponse(res, StatusCodes.CREATED, "Organisation created successfully", organisation)
    } catch (error) {
        throw new BadRequestError("Client error")
    }

}


// [POST] /api/organisations/:orgId/users
export const addUserToOrganisation = async (req: Request, res: Response) => {
    const { userId } = req.body
    const { orgId } = req.params
    const organisation = await findOrganisationByIdService(orgId)
    if (!organisation) {
        throw new BadRequestError("organisation do not exist")
    }
    const user = await findUserByIdService(userId)
    if (!user) {
        throw new BadRequestError("invalid userId")
     }
    const userAlreadyExist = await getUserOganisation(orgId, userId)
    if (userAlreadyExist) {
        throw new BadRequestError("user added already")
    }
    await addUserToOrganisation_service(orgId, userId)
    return successResponse(res, StatusCodes.OK, "User added to organisation successfully")
}