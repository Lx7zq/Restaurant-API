const Restaurant = require("../models/restaurant.model");

//Create and save a new Restaurant
exports.create = async (req, res) => {
  console.log(req.body);
  const { name, type, ImageUrl } = req.body;

  //Validate data 
  
  if (!name || !type || !ImageUrl) {
    res.status(400).send({
      message: "Name, Type or ImageUrl can not be empty!",
    });
    return;
  }

  await Restaurant.findOne({ where: { name: name } }).then((restaurant) => {
    if (restaurant) {
      res.status(400).send({
        message: " Restaurant already exists! ",
      });
      return;
    }
    // create a restaurant
    const newRestaurant = {
      name: name,
      type: type,
      ImageUrl: ImageUrl,
    };
    Restaurant.create(newRestaurant)
      .then((data) => {
        res.send(data);
      })
      .catch((error) => {
        res.status(500).send({
          message:
            error.message ||
            "Something error occured while creating the restaurant.",
        });
      });
  });
};

//Get all restaurant

exports.getAll = async (req, res) => {
  await Restaurant.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while creating the restaurant.",
      });
    });
};

//Get byID Restaurant
exports.getById = async (req, res) => {
  const id = req.params.id;
  await Restaurant.findByPk(id)
    .then((data) => {
      if (!data) {
        res.status(404).send({ message: "No fond Restaurant with id" + id });
      } else {
        res.send(data);
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while creating the restaurant.",
      });
    });
};

//Update a restaurant
exports.update = async (req, res) => {
  const id = req.params.id;
  await Restaurant.update(req.body, {
    where: {
      id: id,
    },
  })
    .then((num) => {
      if (num == 1) {
        res.send({ message: "Restaurant was update successfully" });
      } else {
        res.send({
          message:
            "Cannot update restaurant with id =" +
            id +
            ".Maybe restaurant was not foud or req.body is empty!",
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while creating the restaurant.",
      });
    });
};

//delete a restaurant
exports.delete = async (req, res) => {
  const id = req.params.id;
  await Restaurant.destroy({ where: { id: id } })
    .then((num) => {
      if (num === 1) {
        res.send({
          message: "Restaurant was Delete successfully",
        });
      } else {
        res.send({
          message: "Cannot delete restaurant with id =" + id + ".",
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while creating the restaurant.",
      });
    });
};
