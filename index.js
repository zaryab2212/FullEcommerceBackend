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
const jwt = require("jsonwebtoken");

const LocalStrategy = require("passport-local").Strategy;
const jwtStrategy = require("passport-jwt").Strategy;
const Extractjwt = require("passport-jwt").ExtractJwt;
const { isAuth, sanitizedUser } = require("./Services/Common");

const SECRET_KEY = "SECRET_KEY";

//jwt Options
const opts = {};
opts.jwtFromRequest = Extractjwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "SECRET_KEY";

//middleware
const server = express();

server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
//pasport js

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    // store: new SQLiteStore ({db:'sessons.db', dir:'./var/db'})
  })
);
server.use(passport.authenticate("session"));

server.use("/products",isAuth(), ProductRouter.router);
server.use("/brands",isAuth(), BrandsRouter.router);
server.use("/category",isAuth(), categoriesRouter.router);
server.use("/users",isAuth(), UserRouter.router);
server.use("/auth", AuthRouter.router);
server.use("/cart",isAuth(), CartRouter.router);
server.use("/orders",isAuth(), OrderRouter.router);
const crypto = require("crypto");
const { ExtractJwt } = require("passport-jwt");

// for passport local stretegy
passport.use(
  "local",
  new LocalStrategy(
    {usernameField: 'email'},
    async function (email, password, done) {
    // usrname is by defult in fuc from passport

    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: "Email or password in incorrect" });
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, {
              message: "Email or password in incorrect",
            });
          }
          const token = jwt.sign(sanitizedUser(user), SECRET_KEY);
          done(null, token);
        }
      );
    } catch (error) {
      done(error);
    }
  })
);

// this will be jwt stretogy
passport.use(
  "jwt",
  new jwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const user = await User.findOne({ id: jwt_payload.sub });
      if (user) {
        return done(null,sanitizedUser(user) );
      } else {
        return done(null, false);
      }
    } catch (error) {
  
        return done(error, false);
      
    }
  })
);

// to create session variables req.user on besing called from call back
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, { user: user.id, role: user.role });
  });
});

// to created session variable  req.user when called form  auth requested

passport.deserializeUser(function (user, cb) {
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
