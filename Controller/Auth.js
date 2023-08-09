const { User } = require("../model/User")



exports.createUser = async(req,res) =>{
    const user =  new User(req.body)    
    try {
        const doc = await user.save()
        res.status(201).json({id:doc.id, role:doc.role})
    } catch (error) {
        res.status(400).json(error)
    } 
}

exports.loginUser = async(req,res)=>{
     const {email,password} = req.body;
     try {
            const user = await User.findOne({email})
         
            if(!user){
                return res.status(400).json({message:"Email or Password is ddincorrect"})
            }
          
           else if(user.password !== password) {
                return res.status(400).json({message:"Email or Password is ddincorrect"})
            }
            
            res.status(201).json({user:user.id, role:user.role})

     } catch (error) {
        res.status(400).json(error)
     }
}