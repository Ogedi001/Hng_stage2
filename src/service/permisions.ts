import { prisma } from "../client";


export const findPermision = async (
    name: string,
    roleId:string
  )=>{
    return await prisma.permission.findUnique({ where: {name,roleId},include:{
      role:{
        select:{
          id:true,
          name:true
        }
      }
    }});
  };
  
  export const getAllUserPermisions= async (
    userId:string
  )=>{
    const permissons = await prisma.permission.findMany({ where: {
      role:{
        user:{
          some:{
            id:userId
          }
        }
      }
    }});
    return permissons
  };
  
  
  