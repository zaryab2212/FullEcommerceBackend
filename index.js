const express = require("express");
const mongoose = require("mongoose");
const { createProduct } = require("./Controller/Product");
const ProductRouter = require("./routes/Product");
const BrandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Category");
const UserRouter = require("./routes/User")
const AuthRouter= require("./routes/Auth")
const cors = require("cors");
const CartRouter = require ("./routes/Cart");
const { connection } = require("./connection/server");
const OrderRouter = require("./routes/Order")





//middleware
const server = express();

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use("/products", ProductRouter.router);
server.use("/brands", BrandsRouter.router);
server.use("/category", categoriesRouter.router);
 server.use("/users", UserRouter.router)
 server.use("/auth", AuthRouter.router);
 server.use("/cart", CartRouter.router)
 server.use('/orders', OrderRouter.router)



 connection().catch((error) => console.log(error));

server.get("/", (req, res) => {
  res.json({ date: "succes" });
});

server.listen(8080, () => {
  console.log("server Started");
});
