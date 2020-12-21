import express from "express";
import LocationsController from "../controllers/LocationsController";
import auth from "../middlewares/auth";

const routes = express.Router();

routes
  .route("/provinces")
  .get(auth.checkToken, LocationsController.findProvinces);
routes
  .route("/districts/:province_id")
  .get(auth.checkToken, LocationsController.findDistricts);
routes
  .route("/sectors/:district_id")
  .get(auth.checkToken, LocationsController.findSectors);
routes
  .route("/cells/:sector_id")
  .get(auth.checkToken, LocationsController.findCells);
routes
  .route("/villages/:cell_id")
  .get(auth.checkToken, LocationsController.findVillages);

export default routes;
