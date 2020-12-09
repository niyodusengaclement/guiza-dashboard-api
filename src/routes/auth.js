import express from "express";
import UsersController from "../controllers/UsersController";
import UserValidations from "../validations/UserValidations";

const routes = express.Router();

routes.post("/login", UsersController.login);
routes.post(
  "/register",
  UserValidations.register,
  UsersController.register
);

export default routes;
