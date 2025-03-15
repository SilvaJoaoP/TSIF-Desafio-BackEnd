const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const authRoutes = require("./auth.routes");
const taskRoutes = require("./task.routes");

const routes = Router();

routes.use("/auth", authRoutes);

routes.use(authMiddleware);

routes.use("/tasks", taskRouting);
routes.use("/tags", tagRouting);

module.exports = routes;
