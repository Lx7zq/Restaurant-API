const jwt = require("jsonwebtoken");
const congfig = require("../config/auth.config");
const db = require("../models");
const User = db.User;

//verify token
verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  //1st verify
  if (!token) {
    return res.status(403).send({ message: "No token provieded!" }); //401 รู้แต่ไม่มีสิทธ์ 403 ไม่รู้จักว่าเป็นใคร
  }
  jwt.verify(token, congfig.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};
// isAdmin middleware
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) { 
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(401).send({ message: "Require Admin Role!" });
    });
  });
};

// isMod middleware
isMod = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) { 
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      res.status(401).send({ message: "Require Moderator Role!" });
    });
  });
};

// isModOrAdmin middleware
isModOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) { 
        if (roles[i].name === "moderator" || roles[i].name === "admin") {
          next();
          return;
        }
      }
      res.status(401).send({ message: "Require Moderator or Admin Role!" });
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isMod,
  isModOrAdmin,
};
module.exports = authJwt;
