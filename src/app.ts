import "dotenv/config";
import "express-async-errors";
import express, {
  Request,
  Response,
  NextFunction,
  Application,
  urlencoded,
} from "express";
import { createServer } from "http";

// security middleware
import helmet from "helmet";
import { errorHandlerMiddleware, pageNotFound } from "./middleware/index";
import { StatusCodes } from "http-status-codes";
import { applicationRoutes } from "./routes";
import Logger from "./utils/logger";
import { authUserRoute } from "./routes/auth-route";



const app: Application = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());


const server = createServer(app);


app.get("/", (req: Request, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json({ message: "Welcome to HNG Backend STAGE_2 Api version 1.0 🔥🔥🔥" });
});
app.use('/auth',authUserRoute)
app.use("/api", applicationRoutes);

app.use(errorHandlerMiddleware);

app.use(pageNotFound);

export default server;
