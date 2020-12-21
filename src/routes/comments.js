import express from "express";
import CommentsController from "../controllers/CommentsController";
import auth from "../middlewares/auth";
import Roles from "../middlewares/Roles";
import CommentsValidations from "../validations/CommentsValidations";

const routes = express.Router();

routes
  .route("/")
  .get(auth.checkToken, CommentsController.findAll)
  .post(
    auth.checkToken,
    CommentsValidations.comment,
    CommentsController.create
  );

routes
  .route("/:comment_id")
  .get(auth.checkToken, CommentsController.findOne)
  .put(auth.checkToken, CommentsValidations.comment, CommentsController.update)
  .delete(auth.checkToken, Roles.admin, CommentsController.delete);

export default routes;
