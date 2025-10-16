const {User}  = require('../models/sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()
// exports.login = 
const login = async (req,res) =>{
    const {email,password} = req.body;
    const user = await User.findOne({attributes:['email','password'],where:{email}})
    if(!user){
        res.status(404).json({status:"failure",message:"User not found with the given credentials"})
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match)
        res.status(401).json({status:"failure",message:"Credentials didn't match"})
    else
    {
        const token = jwt.sign({user},process.env.JWT_SECRET_KEY,{expiresIn:60})
        res.status(200).json({status:"Success",message:"User found successfully",data:{user,token:token}})
    }
}

module.exports = {login}


