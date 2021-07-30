const userController = require("../controllers/auth");
const { check, body } = require("express-validator/check");
const User = require("../models/User");
const express = require('express')
const router = express.Router()

// SIGN UP

router.get("/signup", userController.getSignup);
router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((result) => {
          if (result) {
            return Promise.reject("Email exists already");
          }
        });
      }),
    body("password")
      .isLength({ min: 5 })
      .withMessage("Please enter a password with at least 5 characters")
      .isAlphanumeric(),
    body("confirm_password").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    //.matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i")
  ],
  userController.postSignup
);

//LOGOUT
router.post("/logout", userController.logout);

//PASSWORD RESET
router.get("/getResetPassword", userController.getResetPassword);
router.post("/postResetPassword", userController.postResetPassword);
router.get("/reset/:token", userController.getNewPassword);
router.post("/post-new-password", userController.postNewPassword);

// LOGIN
router.get("/login", userController.getLogin);
router.post("/login", userController.postLogin);

module.exports = router