const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ status: "failure", message: "Email and password are required" });
    }

    // 2️⃣ Find user by email
    const user = await User.findOne({ email }).select("email password name");
    if (!user) {
      return res.status(404).json({
        status: "failure",
        message: "User not found with the given credentials",
      });
    }

    // 3️⃣ Compare password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ status: "failure", message: "Credentials didn't match" });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email,name:user.name },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" } 
    );
    console.log("TTTTTTTTT",token)
    // 5️⃣ Send response with token (cookie optional)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite:"none",
      maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
      status: "Success",
      message: "User logged in successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return sendResponse(res, "failure", "All fields (name, email, password) are required", null, 400);

    const existingUser = await User.findOne({ email });
    if (existingUser)
    res.status(409).json({
        status: "failure",
        message: "User with this email already exists",
      });
    
  const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password:hashedPassword });
    const token = jwt.sign({id:user.id,email:user.email,name:user.name},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
    res.cookie('token',token,{httpOnly:true,secure:true,maxAge:3600000,sameSite:"none"});
    res.status(201).json({status: "Success", message: "User created successfully", data: user});
  } catch (err) {
    res.status(500).json({
        status: "failure",
        message: "Error creating user",
        error: err.message,
      });
  }
};
exports.verifyToken =async (req,res)=>{
    const token = req.cookies.token;
    console.clear()
    console.log("Verifying token:",token);
    if(!token){
        return res.status(401).json({status:"failure",message:"No token provided"});
    }
 
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        const user = {id:decoded.id,email:decoded.email,name:decoded.name};
        return res.status(200).json({status:"Success",message:"Token is valid",data:user  });
    }catch(err){
        return res.status(401).json({status:"failure",message:"Invalid token",error:err.message});
    }
}