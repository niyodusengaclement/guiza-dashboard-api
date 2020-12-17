import express from "express";
import auth from "./auth";
import menus from "./menus";
import choices from "./choices";

const routes = express.Router();

routes.use("/auth", auth);
routes.use("/menus", menus);
routes.use("/choices", choices);

export default routes;
