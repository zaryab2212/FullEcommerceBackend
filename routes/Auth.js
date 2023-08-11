const express = require("express");
const { createUser, loginUser, checkUser} = require("../Controller/Auth");
const passport = require("passport");
const router = express.Router();

router
  .post("/signup", createUser)
  .post("/login", passport.authenticate("local"), loginUser)
  router.get('/check',passport.authenticate("jwt"), checkUser)

exports.router = router;
// pasport.authenticate,('jwt'),