const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../controllers/homeController.js");

homeRouter.get("/", homeController.homeGet);
homeRouter.get("/inventory", homeController.namesGet);
homeRouter.get("/inventory/info", homeController.itemInfoGet);
module.exports = homeRouter;
