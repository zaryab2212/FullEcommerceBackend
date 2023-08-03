const express = require('express');
const { createCategory, fetchCategories } = require('../Controller/Category');
const router = express.Router()

router.get("/",fetchCategories).post("/",createCategory)



exports.router= router;