const User = require("../models/user");

exports.addUser = async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({
      status: "failure",
      message: "Name and email are required",
    });
  }
  try {
    const user = await User.create({ name, email });
    res
      .status(201)
      .json({ status: "Success", message: "User created successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ status: "failure", message: "User not created", error: err });
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(1);
    if(!user){
        res.status(404).json({status:"failure",message:"User Not Found"})
    }
    res.status(200).json({status:"Success",message:"User fetched successfully"})
  } catch (err) {
    res.status(500).json({status:"failure",message:`Error in fetching in user ${err}`})
  }
};
