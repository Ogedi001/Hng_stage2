import { Role, RoleName } from "@prisma/client";
import { prisma } from "../client";
import { permissionData } from "../data/permissionSeed";
import { UserPermissions } from "../interface";

export const createRole = async (name: RoleName): Promise<Role> => {
  const existingRole = await prisma.role.findFirst({ where: { name } });

  if (!existingRole) {
    return prisma.role.create({
      data: {
        name,
      },
    });
  }
  return existingRole;
};

export const findPermision = async (name: string) => {
  return await prisma.permission.findUnique({
    where: { name },
    include: {
      role: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

export const getUserPermision = async (userId: string,name:string) => {
  const permissons = await prisma.permission.findMany({
    where: {
      name,
      role: {
        user: {
          some: {
            id: userId,
          },
        },
      },
    },
  });
  return permissons;
};


export const getAllUserPermisions = async (userId: string) => {
  const permissons = await prisma.permission.findMany({
    where: {
      role: {
        user: {
          some: {
            id: userId,
          },
        },
      },
    },
  });
  return permissons;
};


export const findNewPermision = async () => {
  return await prisma.permission.findFirst({
    where: { user:null||undefined},
  });
};

export const permisionCheck_absent = async (roleId:string, userId:string) => {
  const possiblePermissions =  await prisma.permission.findMany({
    where: {
      role: {
        id:roleId
      },
    },
  });
  const userPermissions = await prisma.permission.findMany({
    where: {
      role: {
        id:roleId,
      },
        userId
    },
  });
  const absentPermisions= possiblePermissions.filter(possiblePermision=>{
  return userPermissions.some(userPermissions=>possiblePermision.name!=userPermissions.name)
  }).map(permission=>({
    roleld:permission.roleId,
    name:permission.name,
    can_read:permission.can_read,
    can_write:permission.can_write,
    can_delete:permission.can_delete,
    userId,
  }))

  return absentPermisions
};

export const permisionCheck_createMany =async(data:UserPermissions[])=>{
  const permissionData = data.map(fields => ({
    roleId: fields.roleId!,
    ...fields,
  }));
await prisma.permission.createMany({
  data:permissionData
})
}

export const updatePermissionService= async (id:string,data:UserPermissions) => {
  return await prisma.permission.update({
    where: {
      id
      },
   data
  });

}



export const createPermission_Service =async(data:UserPermissions)=>{
  const fields = {
    roleId: data.roleId!,
    ...data,
  }
return await prisma.permission.create({
  data:fields
})
}
