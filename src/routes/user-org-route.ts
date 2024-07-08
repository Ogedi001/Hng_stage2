import { Router } from "express";
import { currentUserMiddleware, validateRequestMiddleware } from "../middleware";
import { addUserToOrganisation, createOrganisation, getOrganisationById, getUser_Controller, getUserOrganisations } from "../controller/user-org-controller";
import { addUserToOrganisationSchema, createOrganisationSchema, getOrganisationSchema, getUserSchema } from "../schema/user-org-schma";

const router = Router();

router.route("/organisations/:orgId/users").post(addUserToOrganisationSchema(), validateRequestMiddleware, addUserToOrganisation);

router.use(currentUserMiddleware);

router.route('/users/:id').get(getUserSchema(), validateRequestMiddleware, getUser_Controller);

router.route('/organisations').get(getUserOrganisations).post(createOrganisationSchema(), validateRequestMiddleware, createOrganisation);

router.route('/organisations/:orgId').get(getOrganisationSchema(), validateRequestMiddleware, getOrganisationById);

export { router as userOrg_Route };
