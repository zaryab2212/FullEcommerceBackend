const { Product } = require("../model/Product.js");

// router.get("/",)
exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try {
    const doc = await product.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchAllProducts = async (req, res) => {
  let query = Product.find({deleted:{$ne:true}});
  let totalProductQuery =  Product.find({deleted:{$ne:true}});

  if (req.query.category) {
    query = query.find({ category: req.query.category });
    totalProductQuery = totalProductQuery.find({
      category: req.query.category,
    });
  }
  if (req.query.brand) {
    query = query.find({ brand: req.query.brand });
    totalProductQuery = totalProductQuery.find({ brand: req.query.brand });
  }
  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalProductQuery = totalProductQuery.sort({
      [req.query._sort]: req.query._order,
    });
  }
  const totaldocs = await totalProductQuery.count().exec();
  console.log(totaldocs);

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totaldocs);
    res.status(201).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchProductbyid = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById({ _id: id });
    // if(!product){
    //     res.status(400).json({sucess: false, message:"Unable to fine"})}

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate (id,req.body,{new:true});
    // if(!product){
    //     res.status(400).json({sucess: false, message:"Unable to fine"})}

    res.status(200).json( product );
  } catch (error) {
    res.status(400).json(error);
  }
};
