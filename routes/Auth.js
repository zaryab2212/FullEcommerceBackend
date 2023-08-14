const express = require("express");
const { createUser, loginUser, checkUser, checkAuth } = require("../Controller/Auth");
const passport = require("passport");
const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  .get("/check",passport.authenticate("jwt"), checkAuth );

exports.router = router;
// pasport.authenticate,('jwt'),
