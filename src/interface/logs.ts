import { ActivityLogType, RoleName } from "@prisma/client";

export interface LogData {
    userId:string
    logType:ActivityLogType
    location?: string;
    zipCode?: string;
    timeZone_name?: string;
    timeZone_gmt_offset?: string;
    newRole?: RoleName;
    preRole?: RoleName;
    description?: string;
    permissionName?: string;
    permissionBols?: {
      pre_can_read?: boolean;
      pre_can_write?: boolean;
      pre_can_delete?: boolean;
      post_can_read?: boolean;
      post_can_write?: boolean;
      post_can_delete?: boolean;
    };
  }
  