const mongoose = require('mongoose');

// Import all models
const User = require('./user');
const Task = require('./task');
const Note = require('./notes');
const Loan = require('./loan');
const LoanPayment = require('./loanPayment');

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

// Export everything together (like your Sequelize setup)
module.exports = {
  connectDB,
  User,
  Task,
  Note,
  Loan,
  LoanPayment,
};
