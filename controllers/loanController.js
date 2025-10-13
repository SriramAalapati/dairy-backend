const Loan = require('../models/loan');
const LoanPayment = require('../models/loanPayment');
const { Op, Sequelize } = require('sequelize');

// Helper function to calculate remaining balance
const calculateLoanBalance = async (loan) => {
    // 1. Get total payments made for this loan
    const totalPaymentsResult = await LoanPayment.findAll({
        attributes: [
            [Sequelize.fn('SUM', Sequelize.col('paymentAmount')), 'totalPaid']
        ],
        where: { loanId: loan.id },
        raw: true,
    });
    
    const totalPaid = parseFloat(totalPaymentsResult[0].totalPaid || 0);

    // 2. Calculate remaining balance (Principal - Total Payments)
    // NOTE: This simple calculation does NOT account for accrued interest.
    // For a simple personal tracker, this might be sufficient.
    const remainingPrincipal = parseFloat(loan.amount) - totalPaid;

    return {
        totalPaid: totalPaid,
        remainingBalance: remainingPrincipal.toFixed(2),
        isPaidOff: remainingPrincipal <= 0,
    };
};

// --- CRUD Operations for Loan ---

exports.createLoan = async (req, res) => {
    const { lenderName, lenderType, amount, interestRate, takenDate, dueDate, userId } = req.body;
    
    if (!lenderName || !amount || !userId) {
        return res.status(400).json({ status: "failure", message: "Required fields (lenderName, amount, userId) are missing" });
    }

    try {
        const newLoan = await Loan.create({ 
            lenderName, lenderType, amount, interestRate, takenDate, dueDate, userId 
        });

        res.status(201).json({ 
            status: "Success", 
            message: "New Loan Added Successfully", 
            data: newLoan 
        });
    } catch (err) {
        console.error("Error creating loan:", err);
        res.status(500).json({ status: "failure", message: "Error adding loan", error: err.message });
    }
};

exports.getLoans = async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ status: "failure", message: "User ID is required" });
    }

    try {
        const loans = await Loan.findAll({
            where: { userId },
            order: [['takenDate', 'DESC']],
        });

        // 3. Attach balance and payment data to each loan
        const loansWithDetails = await Promise.all(loans.map(async (loan) => {
            const balanceData = await calculateLoanBalance(loan);
            
            // Get last payment date for dashboard display
            const lastPayment = await LoanPayment.findOne({
                where: { loanId: loan.id },
                order: [['paymentDate', 'DESC']],
            });

            return {
                ...loan.toJSON(),
                ...balanceData,
                lastPaymentDate: lastPayment ? lastPayment.paymentDate : null,
            };
        }));

        res.status(200).json({
            status: "Success",
            message: "Loans fetched successfully",
            data: loansWithDetails,
        });
    } catch (error) {
        console.error("Error fetching loans:", error);
        res.status(500).json({
            status: "failure",
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.updateLoan = async (req, res) => {
    const { id, ...updateData } = req.body;
    
    if (!id) {
        return res.status(400).json({ status: "failure", message: "Loan ID is required for update" });
    }

    try {
        const [updatedCount] = await Loan.update(updateData, { where: { id } });

        if (updatedCount > 0) {
            res.status(200).json({ 
                status: "Success", 
                message: "Loan Updated Successfully" 
            });
        } else {
            res.status(404).json({ 
                status: "failure", 
                message: "No loan found to update" 
            });
        }
    } catch (error) {
        console.error("Error updating loan:", error);
        res.status(500).json({ 
            status: "failure", 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

exports.deleteLoan = async (req, res) => {
    const { id } = req.body;
    
    if (!id) {
        return res.status(400).json({ status: "failure", message: "Loan ID is required for deletion" });
    }

    // Use a transaction to ensure both loan and payments are deleted
    const t = await sequelize.transaction();

    try {
        // Delete all associated payments first
        await LoanPayment.destroy({ where: { loanId: id } }, { transaction: t });
        
        // Then delete the loan
        const deletedCount = await Loan.destroy({ where: { id } }, { transaction: t });

        if (deletedCount > 0) {
            await t.commit();
            res.status(200).json({ 
                status: "Success", 
                message: "Loan and all associated payments deleted Successfully" 
            });
        } else {
            await t.rollback();
            res.status(404).json({ 
                status: "failure", 
                message: "No loan found to delete" 
            });
        }
    } catch (error) {
        await t.rollback();
        console.error("Error deleting loan:", error);
        res.status(500).json({ 
            status: "failure", 
            message: "Internal server error", 
            error: error.message 
        });
    }
};  