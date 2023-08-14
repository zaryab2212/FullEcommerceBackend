const express = require("express");
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
const JwtStrategy = require("passport-jwt").Strategy;
const Extractjwt = require("passport-jwt").ExtractJwt;
const {  sanitizedUser,  isAuth, cookieExtractor } = require("./Services/Common");

const SECRET_KEY = "SECRET_KEY";

//jwt Options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

const server = express();
//middleware

server.use(express.json());
server.use(
  session({
    secret: "keyboard cat",
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

server.use(cookieParser());
//pasport js



server.use(express.static("build"));
server.use("/products", isAuth(), ProductRouter.router);
server.use("/brands",isAuth(),  BrandsRouter.router);
server.use("/category",isAuth(),  categoriesRouter.router);
server.use("/users",isAuth(),  UserRouter.router);
server.use("/auth", AuthRouter.router);
server.use("/cart", isAuth(), CartRouter.router);
server.use("/orders",isAuth(),  OrderRouter.router);

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
         
          const token = jwt.sign(sanitizedUser(user), SECRET_KEY);
          
          done(null, {id: user._id, role: user.role} ); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

// this will be jwt stretogy
//passport.use(
//"jwt",
//new jwtStrategy(opts, async function (jwt_payload, done) {
//try {
//const user = await User.findOne({ id: jwt_payload.sub });
//if (user) {
// return done(null, sanitizedUser(user));
//} else {
//return done(null, false);
// }
//} catch (error) {
//return done(error, false);
//}
//})
//);

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
    return cb(null, { id: user._id, role: user.role });
  });
});

// to created session variable  req.user when called form  auth requested

passport.deserializeUser(function (user, cb) {
  console.log('De',user)

  process.nextTick(function () {
    return cb(null, user);
  });
});

connection().catch((error) => console.log(error));

server.get("/", (req, res) => {
  res.json({ data: "succes" });
});

server.listen(8080, () => {
  console.log("server Started");
});
