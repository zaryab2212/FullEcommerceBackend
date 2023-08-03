const express = require("express")
const mongoose = require("mongoose");
const { createProduct } = require("./Controller/Product");
const ProductRouter = require("./routes/Product")
const BrandsRouter = require("./routes/Brands")
const categoriesRouter = require("./routes/Category")
const cors = require("cors")


async function conntion(){
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");
    console.log("DateBase is ready to use")
}

//middleware
const server = express()



server.use(cors({
    exposedHeaders:["X-Total-Count"]
}))
server.use(express.json())
server.use("/products", ProductRouter.router )
server.use("/brands", BrandsRouter.router )
server.use("/category", categoriesRouter.router )

conntion().catch
((error)=>
console.log(error))


server.get( "/" ,(req,res)=>{
    res.json( {date: "succes"})
})
 








server.listen(8080,()=>{
    console.log("server Started")
})