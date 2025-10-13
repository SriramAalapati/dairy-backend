const { DataTypes } = require('sequelize');
const sequelize = require('./index'); 
const User = require('./user'); 

const Loan = sequelize.define('Loan', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    
    // Core Details
    lenderName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lenderType: {
        type: DataTypes.ENUM('Bank', 'Person', 'Other'),
        allowNull: false,
        defaultValue: 'Other',
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2), // Principal amount
        allowNull: false,
    },
    interestRate: {
        type: DataTypes.DECIMAL(5, 2), // Annual rate (e.g., 5.5)
        allowNull: false,
        defaultValue: 0.00,
    },
    
    // Dates
    takenDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
    },
    paidOffDate: {
        type: DataTypes.DATEONLY, // Date the loan was fully paid
        allowNull: true,
    },

    // Status & Notes
    repaymentTerms: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('Active', 'Paid Off', 'Default', 'Pending'),
        allowNull: false,
        defaultValue: 'Active',
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'loans',
    timestamps: true,
});

Loan.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

module.exports = Loan;