const express = require('express');
const { fetchbrands, createBrand } = require('../Controller/Brand');
const router = express.Router()

router.get("/",fetchbrands).post("/",createBrand)



exports.router= router;