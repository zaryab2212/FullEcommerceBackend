const { Category } = require("../model/Category");

exports.fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error) {
    res.status(200).json(error);
  }
};

exports.createCategory = async(req,res,next) =>{
    const category =  new Category(req.body)    
    try {
        const doc = await category.save()
        res.status(201).json(doc)
    } catch (error) {
        res.status(400).json(error)
    } 
}