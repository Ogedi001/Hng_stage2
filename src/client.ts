import { PrismaClient } from "@prisma/client";

import { Password } from "./helpers";
import Logger from "./utils/logger";


// Initialize Prisma client instance with extensions and event listeners
const prismaClient = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }, { emit: 'event', level: 'error' }],
  errorFormat: 'pretty',
});

// intercept and hash passwords before save
prismaClient.$use(async (params, next) => {
  if (
    (params.model == "User") &&
    (params.action == "create" || params.action == "update")
  ) {
    Logger.info({ data: params.args.data });
    if (params.args.data.password) {
      const hashedPassword = await Password.toHash(params.args.data.password);

      params.args["data"] = {
        ...params.args.data,
        password: hashedPassword,
      };
    } else {
      params.args["data"] = {
        ...params.args.data,
      };
    }
  }

  return next(params);
});


prismaClient.$on("query", (e) => Logger.info(e));
prismaClient.$on("error", (e) => Logger.error(e));

export const prisma = prismaClient;
