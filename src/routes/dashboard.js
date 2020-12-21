import express from "express";
import DashboardController from "../controllers/DashboardController";
import auth from "../middlewares/auth";

const routes = express.Router();

routes.get("/", auth.checkToken, DashboardController.index);

export default routes;
