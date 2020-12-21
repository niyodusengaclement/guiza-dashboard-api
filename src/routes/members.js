import express from "express";
import MembersController from "../controllers/MembersController";
import auth from "../middlewares/auth";
import MembersValidations from "../validations/MembersValidations";

const routes = express.Router();

routes.post(
  "/",
  auth.checkToken,
  MembersValidations.member,
  MembersController.create
);
routes.get("/", auth.checkToken, MembersController.findAll);

routes
  .route("/:member_id([0-9]{1,10})")
  .get(auth.checkToken, MembersController.findOne)
  .put(auth.checkToken, MembersValidations.member, MembersController.update)
  .delete(auth.checkToken, MembersController.delete);

routes.get("/search", auth.checkToken, MembersController.search);
routes.post(
  "/upload/:group_id([0-9]{1,10})",
  auth.checkToken,
  MembersController.uploadMembers
);
export default routes;
