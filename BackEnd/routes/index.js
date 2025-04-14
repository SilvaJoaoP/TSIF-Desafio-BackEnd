const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const authRouting = require("./authRouting"); 
const taskRouting = require("./taskRouting"); 
const tagRouting = require("./tagRouting"); 

const routes = Router();

routes.use("/auth", authRouting);

routes.use(authMiddleware);

routes.use("/tasks", taskRouting);
routes.use("/tags", tagRouting);

module.exports = routes;
