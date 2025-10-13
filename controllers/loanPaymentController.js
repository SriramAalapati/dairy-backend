const Loan = require('../models/loan');
const LoanPayment = require('../models/loanPayment');

exports.addPayment = async (req, res) => {
    const { loanId, paymentAmount, paymentDate, principalPaid, interestPaid } = req.body;
    
    if (!loanId || !paymentAmount) {
        return res.status(400).json({ status: "failure", message: "Loan ID and payment amount are required" });
    }

    try {
        const loan = await Loan.findByPk(loanId);
        if (!loan) {
            return res.status(404).json({ status: "failure", message: "Loan not found" });
        }

        const newPayment = await LoanPayment.create({
            loanId,
            paymentAmount,
            paymentDate,
            principalPaid: principalPaid || paymentAmount, // Simple assumption if breakdown is missing
            interestPaid: interestPaid || 0,
        });

        // Optional: Update loan status to 'Paid Off' if payment equals or exceeds remaining balance
        // This requires re-running the calculateLoanBalance helper logic (omitted here for brevity, 
        // but should be implemented in a service layer function).

        res.status(201).json({
            status: "Success",
            message: "Payment added successfully",
            data: newPayment,
        });
    } catch (err) {
        console.error("Error adding payment:", err);
        res.status(500).json({ status: "failure", message: "Error processing payment", error: err.message });
    }
};

exports.getPaymentsByLoan = async (req, res) => {
    const { loanId } = req.query;

    if (!loanId) {
        return res.status(400).json({ status: "failure", message: "Loan ID is required" });
    }

    try {
        const payments = await LoanPayment.findAll({
            where: { loanId },
            order: [['paymentDate', 'DESC']],
        });

        res.status(200).json({
            status: "Success",
            message: "Payments fetched successfully",
            data: payments,
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ status: "failure", message: "Internal server error", error: error.message });
    }
};