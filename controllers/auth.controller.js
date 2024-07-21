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

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.status(400).send({
      message: "โปรดระบุชื่อผู้ใช้และรหัสผ่าน",
    });
    return;
  }
  await User.findOne({
    where: { username: username },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).sen({
          accessToken: null,
          message: "Invalid password",
        });
      }
      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, //1day
      });

      const authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLES_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((error) => {
      res.status(500).send({
        message:
          error.message ||
          "Something error occured while registering a new user.",
      });
    });
};