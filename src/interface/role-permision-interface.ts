
export interface UserPermissions{
    userId?:string
    roleId?: string;
    name: string;
    can_read: boolean;
    can_write: boolean;
    can_delete: boolean
  }

  export interface UserRole {
    id?: string;
    name: string;
  }