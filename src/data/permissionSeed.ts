import { RoleName } from "@prisma/client";

const permissionsSeed = [
  // User Permissions
  {
    roleName: "USER",
    permissions: [
      { name: "Own_Posts", can_read: true, can_write: true, can_delete: true },
      {
        name: "Follower_Posts",
        can_read: true,
        can_write: false,
        can_delete: false,
      },
      {
        name: "Followed_User_Posts",
        can_read: true,
        can_write: false,
        can_delete: false,
      },
      { name: "Like_Posts", can_read: true, can_write: true, can_delete: true },
      {
        name: "Comment_Posts",
        can_read: true,
        can_write: true,
        can_delete: true,
      },
      {
        name: "Notifications",
        can_read: true,
        can_write: false,
        can_delete: true,
      },
      {
        name: "Own_Profile",
        can_read: true,
        can_write: true,
        can_delete: true,
      },
      {
        name: "Other_User_Profiles",
        can_read: true,
        can_write: false,
        can_delete: false,
      },
      {
        name: "Follow_Other_Users",
        can_read: true,
        can_write: true,
        can_delete: false,
      },
    ],
  },
  // Moderator Permissions
  {
    roleName: "MODERATOR",
    permissions: [
      {
        name: "Other_Users_Post",
        can_read: true,
        can_write: false,
        can_delete: true,
      },
      {
        name: "Other_Users_Comment",
        can_read: true,
        can_write: false,
        can_delete: true,
      },
      { name: "Ban_Users", can_read: true, can_write: true, can_delete: false },
      {
        name: "Notifications",
        can_read: true,
        can_write: true,
        can_delete: true,
      },
      {
        name: "Manage_Users_Permissions",
        can_read: true,
        can_write: true,
        can_delete: false,
      },
    ],
  },
  // Admin Permissions
  {
    roleName: "ADMIN",
    permissions: [
      {
        name: "Manage_Roles_And_Permissions",
        can_read: true,
        can_write: true,
        can_delete: true,
      },
      {
        name: "Access_Admin_Dashboard",
        can_read: true,
        can_write: true,
        can_delete: true,
      },
      {
        name: "View_Audit_Logs",
        can_read: true,
        can_write: false,
        can_delete: false,
      },
      {
        name: "Manage_Users",
        can_read: true,
        can_write: true,
        can_delete: true,
      },
    ],
  },
];

export const permissionData = (role: string) => {
  switch (role) {
    case "USER":
      return permissionsSeed
        .filter((permission) => permission.roleName === RoleName.USER)
        .flatMap((permission) => permission.permissions);

    case "MODERATOR":
      return permissionsSeed
        .filter(
          (permission) =>
            permission.roleName === RoleName.USER ||
            permission.roleName === RoleName.MODERATOR
        )
        .flatMap((value) => value.permissions);

    case "ADMIN":
      return permissionsSeed.flatMap((permission) => permission.permissions);
    default:
      return [];
  }
};

//  const value = permissionData(RoleName.ADMIN)
//     console.log(value)
// const data = value.map(permission=>({...permission,roleId:'djdjd'}))
// console.log(data)
