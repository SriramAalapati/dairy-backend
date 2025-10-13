const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Loan = require('./loan');

const LoanPayment = sequelize.define('LoanPayment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    
    // Payment Details
    paymentAmount: {
        type: DataTypes.DECIMAL(10, 2), // The amount paid in this transaction
        allowNull: false,
    },
    
    // The date the payment was made
    paymentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    
    // Optional: breakdown of how much was applied to principal vs. interest
    principalPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true, // Can be null if interest breakdown is not tracked
    },
    interestPaid: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    
    // Reference to the loan
    loanId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'loans', // table name
            key: 'id',
        }
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'loan_payments',
    timestamps: true,
});

// Define the association: A payment belongs to one loan
LoanPayment.belongsTo(Loan, { foreignKey: 'loanId' });
// A Loan can have many payments
Loan.hasMany(LoanPayment, { foreignKey: 'loanId', as: 'payments' });

module.exports = LoanPayment;