
const passport = require("passport")

exports.isAuth = (req, res,done)=>{ 
     return passport.authenticate('jwt')
  
  
  }
  

  exports.sanitizedUser = (user)=>{

    return{_id:user._id, role:user.role}

  }
  
 exports.cookieExtractor = function(req){
      let token = null
        if (req && req.cookies){
         token = req.cookies['jwt'] }
      token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGQ5ZmQ1NmEwMzIxNjhjNmViNWEwNzgiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5MjAwNzc2Nn0.-XSMR8IQzU9ogyjBTVml-f5VM8zIM0d1WN1XDVs51Lc"
     return token
 }