import express from "express";
import ChoicesController from "../controllers/ChoicesController";
import auth from "../middlewares/auth";
import MenuValidations from "../validations/MenuValidations";

const routes = express.Router();

routes.post(
  "/",
  auth.checkToken,
  MenuValidations.choice,
  ChoicesController.create
);
routes.get("/", auth.checkToken, ChoicesController.findAll);

routes
  .route("/:record_id")
  .get(auth.checkToken, ChoicesController.findOne)
  .put(auth.checkToken, MenuValidations.choice, ChoicesController.update)
  .delete(auth.checkToken, ChoicesController.delete);

routes.patch(
  "/drop/:ussd_new_state",
  auth.checkToken,
  ChoicesController.updateOnDrop
);

export default routes;
