const express = require("express")
const router = express.Router()
const { fetchbrands, createBrand } = require('../Controller/Brand');


router.get("/",fetchbrands).post("/",createBrand)

exports.router = router

