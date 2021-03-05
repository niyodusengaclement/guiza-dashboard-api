import express from "express";
import GroupsController from "../controllers/GroupsController";
import auth from "../middlewares/auth";
import excelChecker from "../middlewares/excelChecker";
import GroupValidations from "../validations/GroupValidations";

const routes = express.Router();

routes
  .route("/")
  .get(auth.checkToken, GroupsController.findAll)
  .post(auth.checkToken, GroupValidations.group, GroupsController.create);

routes
  .route("/:group_id([0-9]{1,10})")
  .get(auth.checkToken, GroupsController.findOne)
  .put(auth.checkToken, GroupsController.update)
  .delete(auth.checkToken, GroupsController.delete);

routes.get("/search", auth.checkToken, GroupsController.search);
routes
  .route("/migrate")
  .get(auth.checkToken, GroupsController.migrate)
  .post(auth.checkToken, GroupsController.updateMigratedGroups);
routes.post(
  "/upload",
  auth.checkToken,
  excelChecker,
  GroupsController.uploadGroupInfo
);
export default routes;
