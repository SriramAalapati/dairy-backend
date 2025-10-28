const Loan = require("../models/loan");
const LoanPayment = require("../models/loanPayment");

// === Add New Payment ===
exports.addPayment = async (req, res) => {
  const { loanId, paymentAmount, paymentDate, principalPaid, interestPaid } = req.body;

  // --- Basic Validation ---
  if (!loanId || !paymentAmount) {
    return res.status(400).json({
      status: "failure",
      message: "Loan ID and payment amount are required",
    });
  }

  if (paymentAmount <= 0) {
    return res.status(400).json({
      status: "failure",
      message: "Payment amount must be greater than zero",
    });
  }

  try {
    // --- Check if the loan exists ---
    const loan = await Loan.findById(loanId);
    if (!loan) {
      return res.status(404).json({
        status: "failure",
        message: "Loan not found",
      });
    }

    // --- Create a new payment document ---
    const newPayment = await LoanPayment.create({
      loanId,
      paymentAmount: Number(paymentAmount),
      paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
      principalPaid: Number(principalPaid) || Number(paymentAmount),
      interestPaid: Number(interestPaid) || 0,
    });

    // Optional: You could recalculate the loan balance here using the same helper from loanController
    // Example:
    // const updatedBalance = await calculateLoanBalance(loan);
    // if (updatedBalance.isPaidOff) await Loan.findByIdAndUpdate(loanId, { status: "Paid Off" });

    res.status(201).json({
      status: "Success",
      message: "Payment added successfully",
      data: newPayment,
    });
  } catch (err) {
    console.error("Error adding payment:", err);
    res.status(500).json({
      status: "failure",
      message: "Error processing payment",
      error: err.message,
    });
  }
};

// === Get All Payments for a Specific Loan ===
exports.getPaymentsByLoan = async (req, res) => {
  const { loanId } = req.query;

  if (!loanId) {
    return res.status(400).json({
      status: "failure",
      message: "Loan ID is required",
    });
  }

  try {
    // Fetch all payments for a specific loan and include loan info
    const payments = await LoanPayment.find({ loanId })
      .populate("loanId", "lenderName amount interestRate lenderType status")
      .sort({ paymentDate: -1 });

    res.status(200).json({
      status: "Success",
      message: "Payments fetched successfully",
      data: payments || [],
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};
