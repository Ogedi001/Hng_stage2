import { NextFunction, Request, Response } from "express";
import { findNewPermision, permisionCheck_absent,permisionCheck_createMany } from "../service/role-permisions-service";
import logger from "../Logger";

export const permissionCheck= async(req: Request, _: Response, next: NextFunction)=>{
    const user = req.currentUser;
    const newPermision =  await findNewPermision()
    if(user && newPermision){
        const availablePermision = await permisionCheck_absent(user.role.roleId,user.id)
        if(availablePermision && availablePermision.length>0){
            await permisionCheck_createMany(availablePermision)
            logger.info('permissions updated')
            next()
        }
    }
    next()
}