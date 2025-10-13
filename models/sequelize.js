const sequelize = require('./index');
const User = require('./user')
const Task = require('./task')
const Note = require('./notes')
const Loan = require('./loan')
const LoanPayment  = require('./loanPayment')
User.hasMany(Task,{foreignKey:'userId'})
Task.belongsTo(User,{foreignKey:'userId'})


module.exports = {sequelize,User,Task,Note,Loan,LoanPayment}