const { Cart } = require("../model/Cart");

exports.fetchCartByUser = async (req, res) => {
  try {
    const {id} = req.user
    const cartItems = await Cart.find({ user: id  })
      .populate("user")
      .populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.addToCart = async (req, res) => {
  const{_id} = req.user
  try {
    const cart = new Cart({...req.body,user:_id});
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.updateCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json(error);
  }
};
