import express from "express";
import ReasonsController from "../controllers/ReasonsController";
import auth from "../middlewares/auth";
import ReasonsValidations from "../validations/ReasonsValidations";

const routes = express.Router();

routes
  .route("/")
  .get(auth.checkToken, ReasonsController.findAll)
  .post(auth.checkToken, ReasonsValidations.reason, ReasonsController.create);

routes
  .route("/:reason_id")
  .get(auth.checkToken, ReasonsController.findOne)
  .put(auth.checkToken, ReasonsValidations.reason, ReasonsController.update)
  .delete(auth.checkToken, ReasonsController.delete);

export default routes;
