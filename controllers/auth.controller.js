const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

//Register a new user
exports.signup = async (req, res) => {
  const {username, email, password} = req.body;
  if (!username || !email || !password) {
    res.status(400).send({
      message: "Please provide all required fiels",
    });
    return;
  }
  //Prepare user data
  const newUser = {
    uesrname:username,
    email,
    password: bcrypt.hashSync(password, 8),
  };

  //Save user in the database
  await User.create(newUser).then((user) => {
    if (req.body.roles) {
      Role.findAll({
        where: {
          name: { [Op.or]: req.body.roles },
        },
      }).then((roles) => {
        user.setRoles(roles).then(() => {
          res.send({ message: "User resgisterd successfully!" });
        })
      });
    }else{
        //set defautl role to " user " id = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User resgisterd successfully!" });
        });
    }
  }).catch((error)=>{
    res.status(500).send({
        message:
        error.message ||
        "Something error occured while resgistering a new user.",
    })
  })
};
