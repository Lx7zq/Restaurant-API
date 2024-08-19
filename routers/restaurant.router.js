const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controller");
const { authJwt } = require("../middlewares");

//Create a restaurant
//POST http://localhost:5000/api/v1/restaurants/
router.post(
  "/postrestaurant",
  [authJwt.verifyToken, authJwt.isModOrAdmin],
  restaurantController.create
);

//Get all restaurantF
router.get("/", restaurantController.getAll);

//Get byId restaurant
router.get("/:id", [authJwt.verifyToken], restaurantController.getById);

//update a restaurant
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isModOrAdmin],
  restaurantController.update
);

//delete a restaurant
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  restaurantController.delete
);

module.exports = router;
