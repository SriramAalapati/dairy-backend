const sequelize = require('./index')
const {DataTypes} = require('sequelize')

const Task = sequelize.define('task',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    task:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    priority:{
        type:DataTypes.INTEGER,
        allowNull:false,

    }
})
module.exports = Task