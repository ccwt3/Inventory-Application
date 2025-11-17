const { Router } = require("express");
const homeRouter = Router();
const homeController = require("../controllers/homeController.js");

homeRouter.get("/", homeController.homeGet);
homeRouter.get("/inventory", homeController.namesGet);
homeRouter.get("/inventory/info", homeController.itemInfoGet);
homeRouter.post("/inventory/info", homeController.itemInfoPost);
homeRouter.get("/inventory/edit", homeController.itemEditingGet);
homeRouter.post("/inventory/edit", homeController.itemEditingPost);
homeRouter.get("/inventory/create", homeController.createItemGet);
homeRouter.post("/inventory/create", homeController.createItemPost);
module.exports = homeRouter;
