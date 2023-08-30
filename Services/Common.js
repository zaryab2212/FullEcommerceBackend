
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
      // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGRkMWZiZWJhOGI1YjhiMTVmMzE2ZjYiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5MzE0Njc1Mn0.dIDVnee2662xNGYG7PZJqXIzIpTUebsLAaH0iHeOLDY"
     return token
 }