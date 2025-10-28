const User = require("../models/user");
const Note = require("../models/notes");
const Loan = require("../models/loan");
const LoanPayment = require("../models/loanPayment");
const Task = require("../models/task");

exports.getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "failure", message: "User ID is required" });
    }

    // 1️⃣ Get user details
    const userDetails = await User.findById(userId)
      .select("name email")
      .lean();

    if (!userDetails) {
      return res
        .status(404)
        .json({ status: "failure", message: "User not found" });
    }

    // 2️⃣ Fetch all tasks for user
    const taskDetails = await Task.find({ userId }).select("task priority").lean();

    // Categorize tasks by priority
    const highPriorityTasks = taskDetails.filter((task) => task.priority > 7);
    const mediumPriorityTasks = taskDetails.filter(
      (task) => task.priority >= 4 && task.priority <= 7
    );
    const lowPriorityTasks = taskDetails.filter((task) => task.priority <= 4);

    // 3️⃣ Fetch loans for user
    const loans = await Loan.find({ userId }).lean();

    const totalBalance = loans.reduce(
      (total, loan) => total + (loan.amount || 0),
      0
    );

    // 4️⃣ Construct response
    return res.status(200).json({
      status: "Success",
      message: "Data fetched successfully",
      data: {
        ...userDetails,
        taskDetails,
        totalTasks: taskDetails.length,
        pendingTasks: taskDetails.length, // (You can update with a field like `status` later)
        completedTasks: 0, // placeholder
        priorityTasks: {
          High: highPriorityTasks.length,
          Medium: mediumPriorityTasks.length,
          Low: lowPriorityTasks.length,
        },
        highPriorityTasks,
        totalLoans: loans.length,
        totalLoanBalance: totalBalance,
        loans,
        totalPrincipalBorrowed: 0, // placeholder
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};
