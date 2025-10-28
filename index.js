const express = require("express");
const cookieParser = require('cookie-parser')
const {connectDB} = require('./models/index')
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
app.use(cookieParser())
const port = process.env.port || 3000;
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/user",logger.logger, userRouter);
app.use("/tasks",logger.logger, tasksRouter);
app.use("/",logger.logger, dashboardrouter);
app.use("/loans",logger.logger, loanRoutes);
app.use('/auth',logger.logger,authRoutes)
app.use("/loans",logger.logger, loanPaymentRoutes);

app.get("/", (req, res) => {
  res.send("Connected to backend");
});


async function startServer() {
  try {
    // First attempt to sync tables
 await connectDB()
    console.log("Tables synced successfully");
  } catch (error) {
    console.log("First attempt failed, trying to sync tables again...",error);
    process.exit(1)
   
  }

  app.listen(port, () => {
    console.clear()
    console.log("Server running at port", port);
  });
}

startServer();
