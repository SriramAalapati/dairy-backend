const express = require("express");
const { sequelize } = require("./models/sequelize");
const authRoutes = require('./routes/authRoutes')
const userRouter = require("./routes/userRoutes");
const tasksRouter = require("./routes/taskRoutes");
const dashboardrouter = require("./routes/dashboardRoutes");
const loanRoutes = require("./routes/loanRoutes");
const loanPaymentRoutes = require("./routes/loanPaymentRoutes");
const logger = require('./middlewares/logger')
const cors = require("cors");
const app = express();
app.use(express.json());
const port = process.env.port || 3000;
app.use(
  cors({
    origin: "*",
  })
);

app.use("/user",logger.logger, userRouter);
app.use("/tasks",logger.logger, tasksRouter);
app.use("/",logger.logger, dashboardrouter);
app.use("/loans",logger.logger, loanRoutes);
app.use('/auth',logger.logger,authRoutes)
// Apply the loan payment routes (Note: I'm nesting them slightly under /loans here)
app.use("/loans",logger.logger, loanPaymentRoutes);

app.get("/", (req, res) => {
  res.send("Connected to backend");
});



async function startServer() {
  try {
    // First attempt to sync tables
    await sequelize.sync();
    console.log("Tables synced successfully");
  } catch (error) {
    console.log("First attempt failed, trying to sync tables again...");

    try {
      // Second attempt
      await sequelize.sync();
      console.log("Tables synced successfully on second attempt");
    } catch (err) {
      console.error("Error syncing tables after retry:", err);
      // Decide whether to exit process or continue
      return; // Stop server if tables cannot sync
    }
  }

  // Start the server only if tables were synced successfully
  app.listen(port, () => {
    console.log("Server running at port", port);
  });
}

startServer();
