const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const authRouting = require("./auth.routes");
const taskRouting = require("./task.routes");
const tagRouting = require("./tag.routes");

const routes = Router();

routes.use("/auth", authRouting);

routes.use(authMiddleware);

routes.use("/tasks", taskRouting);
routes.use("/tags", tagRouting);

module.exports = routes;
