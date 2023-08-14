const express = require("express")
const { fetchUserById, updateUser } = require("../Controller/User");
const router = express.Router();

router.get("/me",fetchUserById).patch("/:id", updateUser);

exports.router= router