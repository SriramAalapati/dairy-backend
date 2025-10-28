const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lenderName: { type: String, required: true },
    lenderType: {
      type: String,
      enum: ["Bank", "Person", "Other"],
      default: "Other",
    },
    amount: { type: Number, required: true },
    interestRate: { type: Number, default: 0 },
    takenDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    paidOffDate: { type: Date },
    repaymentTerms: { type: String },
    status: {
      type: String,
      enum: ["Active", "Paid Off", "Default", "Pending"],
      default: "Active",
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);
