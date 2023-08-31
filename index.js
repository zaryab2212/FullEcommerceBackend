const express = require("express");
require('dotenv').config()
const mongoose = require("mongoose");
const { createProduct } = require("./Controller/Product");
const ProductRouter = require("./routes/Product");
const BrandsRouter = require("./routes/Brands");
const categoriesRouter = require("./routes/Category");
const UserRouter = require("./routes/User");
const AuthRouter = require("./routes/Auth");
const cors = require("cors");
const CartRouter = require("./routes/Cart");
const { connection } = require("./connection/server");
const OrderRouter = require("./routes/Order");
const passport = require("passport");
const session = require("express-session");
const { User } = require("./model/User");
const jwt = require('jsonwebtoken')
const crypto = require("crypto");
const { ExtractJwt } = require("passport-jwt");
const cookieParser = require("cookie-parser");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy
const Extractjwt = require("passport-jwt").ExtractJwt;
const {  sanitizedUser,  isAuth, cookieExtractor } = require("./Services/Common");
const server = express();
const path = require('path');
const { Order } = require("./model/Order");
//webhook


const endpointSecret = process.env.END_POINT_SEC  ;

server.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
     const order = await Order.findById(paymentIntentSucceeded.metadata.orderId)
     order.paymentStatus = "received"
     order.save() 
     
     break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});


//jwt Options
const opts = {};
opts.jwtFromRequest = cookieExtractor
opts.secretOrKey = process.env.JWT_SECRET_KEY;


//middleware
// server.use(express.raw({type:'application/json'}))
server.use(express.json());
server.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);
server.use(passport.authenticate('session'));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);

server.use(express.static(path.resolve(__dirname,"build")))
server.use(cookieParser());
//pasport js



server.use("/products", isAuth(), ProductRouter.router)
server.use("/brands",isAuth(),  BrandsRouter.router);
server.use("/category",isAuth(),  categoriesRouter.router);
server.use("/users",isAuth(),  UserRouter.router);
server.use("/auth", AuthRouter.router);
server.use("/cart", isAuth(), CartRouter.router);
server.use("/orders",isAuth(),  OrderRouter.router);
server.get("*",(req,res)=>res.sendFile(path.resolve("build",'index.html')))

// for passport local stretegy

passport.use( 
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
     
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
         
          const token = jwt.sign(sanitizedUser(user), process.env.JWT_SECRET_KEY);
          
          done(null, token); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);


passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log( "jwt payload" ,jwt_payload );
    try {
      const user = await User.findById(jwt_payload._id);
      if (user) {
     
        return done(null, sanitizedUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// to create session variables req.user on besing called from call back
passport.serializeUser(function (user, cb) {
  console.log('serial', user)
  process.nextTick(function () {
    return cb(null, { _id: user._id, role: user.role });
  });
});

// to created session variable  req.user when called form  auth requested

passport.deserializeUser(function (user, cb) {
  console.log('De',user)

  process.nextTick(function () {
    return cb(null, user);
  });
});

//payments


const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);





server.post("/create-payment-intent", async (req, res) => {
  const {  totalAmount, orderId } = req.body;

  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount*100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata:{
      orderId
    }
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});










connection().catch((error) => console.log(error));

server.get("/", (req, res) => {
  res.json({ data: "succes" });
});

server.listen(process.env.PORT, () => {
  console.log("server Started");
});
