const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller"); // Corrected variable name
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
  [verifySignUp.checkDuplicateUserNameOrEmail, verifySignUp.checkRolesExisted], // Corrected function name
  authController.signup
);

router.post("/signin", authController.signin);

module.exports = router;
