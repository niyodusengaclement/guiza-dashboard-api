import express from "express";
import auth from "./auth";
import groups from "./groups";
import members from "./members";
import reasons from "./reasons";
import locations from "./locations";
import comments from "./comments";
import approvals from "./approvals";
import admins from "./admins";
import dashboard from "./dashboard";

const routes = express.Router();

routes.use("/auth", auth);
routes.use("/groups", groups);
routes.use("/members", members);
routes.use("/reasons", reasons);
routes.use("/locations", locations);
routes.use("/comments", comments);
routes.use("/approvals", approvals);
routes.use("/admins", admins);
routes.use("/dashboard", dashboard);

export default routes;
