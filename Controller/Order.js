const{Order} = require("../model/Order")

exports.fetchOrdersByUser = async (req, res) => {
  const {userId} = req.params
  try {
    const OrderItems = await Order.find({ user : userId })
    res.status(200).json(OrderItems);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.createOrder = async (req, res) => {

  const order = new Order(req.body);
  try {

    const doc = await order.save();
    
    res.status(201).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Order.findByIdAndDelete(id);
    res.status(200).json(doc );
  } catch (error) {
    res.status(400).json(error);
  }
};
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Order.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(doc);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({deleted:{$ne:true}});
  let totalOrdersQuery =  Order.find({deleted:{$ne:true}});


  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
    totalOrdersQuery = totalOrdersQuery.sort({
      [req.query._sort]: req.query._order,
    });
  }
  const totaldocs = await totalOrdersQuery.count().exec();


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