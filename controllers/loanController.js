const mongoose = require("mongoose");
const Loan = require("../models/loan");
const LoanPayment = require("../models/loanPayment");

// === Helper Function: Calculate Remaining Balance ===
const calculateLoanBalance = async (loan) => {
  // Step 1: Get total payments made for this loan
  const totalPayments = await LoanPayment.aggregate([
    { $match: { loanId: loan._id } },
    { $group: { _id: null, totalPaid: { $sum: "$paymentAmount" } } },
  ]);

  const totalPaid = totalPayments.length ? totalPayments[0].totalPaid : 0;

  // Step 2: Compute remaining balance
  const remainingBalance = parseFloat(loan.amount) - totalPaid;

  return {
    totalPaid,
    remainingBalance: remainingBalance.toFixed(2),
    isPaidOff: remainingBalance <= 0,
  };
};

// === CREATE LOAN ===
exports.createLoan = async (req, res) => {
  const { lenderName, lenderType, amount, interestRate, takenDate, dueDate, userId } = req.body;

  if (!lenderName || !amount || !userId) {
    return res.status(400).json({
      status: "failure",
      message: "Required fields (lenderName, amount, userId) are missing",
    });
  }

  try {
    const newLoan = await Loan.create({
      lenderName,
      lenderType,
      amount,
      interestRate,
      takenDate,
      dueDate,
      userId,
    });

    res.status(201).json({
      status: "Success",
      message: "New Loan Added Successfully",
      data: newLoan,
    });
  } catch (err) {
    console.error("Error creating loan:", err);
    res.status(500).json({
      status: "failure",
      message: "Error adding loan",
      error: err.message,
    });
  }
};

// === GET ALL LOANS (with balance and last payment info) ===
exports.getLoans = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      status: "failure",
      message: "User ID is required",
    });
  }

  try {
    const loans = await Loan.find({ userId }).sort({ takenDate: -1 });

    const loansWithDetails = await Promise.all(
      loans.map(async (loan) => {
        const balanceData = await calculateLoanBalance(loan);
        const lastPayment = await LoanPayment.findOne({ loanId: loan._id }).sort({ paymentDate: -1 });

        return {
          ...loan.toObject(),
          ...balanceData,
          lastPaymentDate: lastPayment ? lastPayment.paymentDate : null,
        };
      })
    );

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

// === UPDATE LOAN ===
exports.updateLoan = async (req, res) => {
  const { id, ...updateData } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "failure",
      message: "Loan ID is required for update",
    });
  }

  try {
    const updatedLoan = await Loan.findByIdAndUpdate(id, updateData, { new: true });

    if (updatedLoan) {
      res.status(200).json({
        status: "Success",
        message: "Loan Updated Successfully",
        data: updatedLoan,
      });
    } else {
      res.status(404).json({
        status: "failure",
        message: "No loan found to update",
      });
    }
  } catch (error) {
    console.error("Error updating loan:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// === DELETE LOAN (with associated payments) ===
exports.deleteLoan = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "failure",
      message: "Loan ID is required for deletion",
    });
  }

  // Start MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete payments first
    await LoanPayment.deleteMany({ loanId: id }).session(session);

    // Delete the loan itself
    const deletedLoan = await Loan.findByIdAndDelete(id).session(session);

    if (!deletedLoan) {
      await session.abortTransaction();
      return res.status(404).json({
        status: "failure",
        message: "No loan found to delete",
      });
    }

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      status: "Success",
      message: "Loan and all associated payments deleted Successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting loan:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};
