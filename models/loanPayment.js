const mongoose = require("mongoose");

const loanPaymentSchema = new mongoose.Schema(
  {
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan", required: true },
    paymentAmount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    principalPaid: { type: Number },
    interestPaid: { type: Number },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LoanPayment", loanPaymentSchema);
