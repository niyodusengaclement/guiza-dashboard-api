import express from "express";
import auth from "./auth";
import menus from "./menus";

const routes = express.Router();

routes.use("/auth", auth);
routes.use("/menus", menus);

export default routes;
