const { sanitizedUser } = require("../Services/Common");
const { User } = require("../model/User");
const crypto = require ("crypto")
const Jwt = require("jsonwebtoken");
// const SECRET_KEY = "SECRET_KEY";
exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });

        const doc = await user.save();

        req.login(sanitizedUser(doc), (err) => {
          // console.log('doc in login' ,doc)
          if (err) {
            res.status(400).json(err);
          } else {
            const token = Jwt.sign(sanitizedUser(doc), process.env.JWT_SECRET_KEY);
// console.log("doc in login ", doc, "toaken", token)
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                 httpOnly: true,
               }).status(201).json({_id:doc._id, role:doc.role});
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};


// for his point of view it was returnin whole of the date of the user so need to be check be focuss zaryab 

exports.loginUser = async (req, res) => {
  const user= req.user
   console.log("login req token ",req.user)
  res.cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 24 *24 * 60 * 60 * 1000),
      httpOnly: true,
    }).status(201).json({_id:user._id, role: user.role});
};
exports.checkUser = async (req, res) => {
  if(req.user){
    res.json(req.user.token);

  }else{
    res.sendStatus(401)
  }
};
exports.checkAuth = async (req, res) => {
  if(req.user){
    res.json(req.user);

  }else{
    res.sendStatus(401)
  } 
};
