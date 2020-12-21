import express from "express";
import AdminsController from "../controllers/AdminsController";
import auth from "../middlewares/auth";
import UserValidations from "../validations/UserValidations";

const routes = express.Router();

routes
  .route("/")
  .get(auth.checkToken, AdminsController.findGroupAdmins)
  .post(
    auth.checkToken,
    UserValidations.admin,
    AdminsController.create
  );

routes
  .route("/:admin_id")
  .delete(auth.checkToken, AdminsController.delete);

export default routes;
