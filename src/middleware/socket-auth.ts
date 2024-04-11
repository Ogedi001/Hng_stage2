import {Socket } from "socket.io";


import { ExtendedError } from "socket.io/dist/namespace";
import { checkBlacklist, Userpayload, verifyJwtToken } from "../helpers";
import logger from "../Logger";





// Define the middleware function
export const socketAuthMiddleware = async (
  socket: Socket,
  next: (err?: ExtendedError | undefined) => void
) => {
  const isAuthenticated = await authenticateUser(socket);

  if (isAuthenticated) {
    logger.info("User is authenticated.");
    next();
  } else {
    next(new Error("User authentication failed."));
  }
};

// Example authentication logic
async function authenticateUser(socket: Socket): Promise<boolean> {
  const clientToken = socket.handshake.auth.token;
  if (!clientToken) {
    return false;
  }
  const isBlacklisted = await checkBlacklist(clientToken);
  if (isBlacklisted) {
    return false;
  }

  return isValidToken(clientToken);
}

function isValidToken(token: string): boolean {
  try {
    const payload = verifyJwtToken(token) as Userpayload;
    return !!payload;
  } catch (error) {
    logger.info("Token Verification Error: ", error);
    return false;
  }
}
