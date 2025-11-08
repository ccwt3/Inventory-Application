const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../controllers/homeController.js");

homeRouter.get("/", homeController.homeGet);

module.exports = homeRouter;
