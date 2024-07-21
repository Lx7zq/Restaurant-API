const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifySignUp } = require("../middlewares");

router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token,Origin,Content-Type,Accept"
  );
  next();
});

router.post(
  "/signup",
  [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted],
  authController.signup
);

router.post("/signin", authController.signin);

module.exports = router;
