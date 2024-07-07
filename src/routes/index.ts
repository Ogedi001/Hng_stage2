import { Router } from "express";
import { userOrg_Route } from "./user-org-route";



const router = Router()


router.use('/',userOrg_Route)

export {router as applicationRoutes}