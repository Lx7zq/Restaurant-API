const config = require("../config/auth.config");
const db = require("../models");
const User = db.User;
const Role = db.Role;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

// Register a new user
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400).send({
      message: "Please provide all required fields",
    });
    return;
  }

  // Prepare user data
  const newUser = {
    username, // Fixed typo here (was 'uesrname')
    email,
    password: bcrypt.hashSync(password, 8),
  };

    //save user in the database
  await User.create(newUser)
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            // Corrected setaRoles to setRoles
            res.send({
              message: "User registered successfully!",
            });
          });
        });
      } else {
        user.setRoles([1]).then(() => {
          res.send({
            message: "User registered successfully!",
          });
        });
      }
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "somthing error occured while registering a new user.",
      });
    });
};


exports.signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "Please provide username and password",
    });
    return;
  }

  try {
    const user = await User.findOne({
      where: { username: username },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 1 day
    });

    const authorities = [];
    const roles = await user.getRoles();

    for (let i = 0; i < roles.length; i++) {
      authorities.push("ROLE_" + roles[i].name.toUpperCase());
    }

    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message || "Something went wrong while signing in.",
    });
  }
};
