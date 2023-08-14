const { User } = require("../model/User");

// exports.fetchUserById = async (req, res) => {
//   try {
//     const user = await User.find({ _id: req.params});
//     if(!user){
//       res.status(400).json({message: "user not fount"})
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     res.status(200).json({ mes: "here is error" });
//   }
// };

exports.fetchUserById = async (req, res) => {

  // const { id } = req.user;
  // console.log(id)
  // try {
  //   const user = await User.findById({_id:id});
  //   res.status(200).json({_id:user.id,addresses:user.addresses,email:user.email,role:user.role});
  // } catch (err) {
  //   res.status(400).json(err);
  // }

  console.log("for fetch id", req.user)
  try {
    const {_id} = req.user 
    const user = await User.findById(_id)
  //  const user = await User.find({ id: user.id,addresses:user.addresses,email:user.email,role:user.role });
 

   // if(!product){
      //  res.status(400).json({sucess: false, message:"Unable to fine"})}

     res.status(200).json(user);
   } catch (error) {
    res.status(400).json(error);
   }
};




exports.updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(id, req.body , {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json(error);
  }
};
