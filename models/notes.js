const sequelize = require('./index')
const {DataTypes} = require('sequelize')

const Note = sequelize.define('note',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    note:{
        type:DataTypes.STRING,
        allowNull:false,
    },

})
module.exports = Note