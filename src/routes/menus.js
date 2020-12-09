import express from "express";
import MenusController from "../controllers/MenusController";
import RightsController from "../controllers/RightsController";
import auth from "../middlewares/auth";
import MenuValidations from "../validations/MenuValidations";

const routes = express.Router();

routes.get("/rights", auth.checkToken, RightsController.getAccessRights);
routes
  .route("/")
  .get(auth.checkToken, MenusController.getMenus)
  .post(auth.checkToken, MenuValidations.menu, MenusController.create);
routes
  .route("/:state_id")
  .get(auth.checkToken, MenusController.findOne)
  .put(auth.checkToken, MenuValidations.menu, MenusController.update)
  .delete(auth.checkToken, MenusController.delete);

routes.post(
  "/choice",
  auth.checkToken,
  MenuValidations.choice,
  MenusController.createChoice
);
routes.post(
  "/child",
  auth.checkToken,
  MenuValidations.child,
  MenusController.createChild
);

routes.patch(
  "/drop",
  auth.checkToken,
  // MenuValidations.drop,
  MenusController.updateOnDrop
);

export default routes;
