const sequelize = require('./index')
const {DataTypes} = require('sequelize')
const User = sequelize.define("user",{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true

    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,

    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true,

    }
})
module.exports = User