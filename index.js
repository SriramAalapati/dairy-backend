const express = require("express")
const {sequelize} = require('./models/sequelize')
const userRouter = require('./routes/userRoutes')
const tasksRouter = require('./routes/taskRoutes')
const dashboardrouter = require('./routes/dashboardRoutes')
const loanRoutes = require('./routes/loanRoutes');
const loanPaymentRoutes = require('./routes/loanPaymentRoutes');

const cors = require('cors')
const app = express()
app.use(express.json())
const port = process.env.port || 3000;
app.use(cors({
    origin:'*',
}))

app.use('/user',userRouter)
app.use('/tasks',tasksRouter)
app.use('/',dashboardrouter)
app.use('/loans', loanRoutes); 

// Apply the loan payment routes (Note: I'm nesting them slightly under /loans here)
app.use('/loans', loanPaymentRoutes); 

app.get("/",(req,res)=>{
    res.send("Connected to backend");
})

sequelize.sync().then(()=>console.log("Tables synced successfully"))
.catch((err)=>console.log("Error syncing in tables",err))
app.listen(port,()=>{
    console.log(`App running at port ${port}`);
})