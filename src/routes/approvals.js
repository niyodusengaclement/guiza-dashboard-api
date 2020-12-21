import express from "express";
import ApprovalsController from "../controllers/ApprovalsController";
import auth from "../middlewares/auth";
import Roles from "../middlewares/Roles";

const routes = express.Router();

routes
  .route("/")
  .get(auth.checkToken, ApprovalsController.findAll)
  .post(auth.checkToken, Roles.admin, ApprovalsController.create);

routes
  .route("/:approval_id")
  .get(auth.checkToken, Roles.admin, ApprovalsController.findOne)
  .put(auth.checkToken, Roles.admin, ApprovalsController.update)
  .delete(auth.checkToken, Roles.admin, ApprovalsController.delete);

export default routes;
