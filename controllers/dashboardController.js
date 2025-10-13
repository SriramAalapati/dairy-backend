const {User,Note,Loan,LoanPayment,Task} = require('../models/sequelize')

exports.getDashboardStats =async  (req,res) =>{
    const {userId} = req.query
    const userDetails =  await User.findOne({
        attributes:['name','email'],
        where:{id:1},
        raw:true
    })
    const taskDetails = await Task.findAll({attributes:["id",'task','priority'],where:{userId}})
    const highPriorityTasks = taskDetails.filter(task =>{
      return  task.priority>7
    })

    const mediumPriorityTasks = taskDetails.filter(task =>{
      return  task.priority>=4 && task.priority<=7
    })

    const lowPriorityTasks = taskDetails.filter(task =>{
      return  task.priority<=4
    })


    const loans =await  Loan.findAll({where:{userId}})
    const totalBalance = loans.reduce((total,loan)=>{
       return total+=loan.amount
    },0)
    res.status(200).json({
        status:"Success",
        message:"Data fetched successfully",
        data:{
            ...userDetails,
            taskDetails:{...taskDetails},
            totalTasks:taskDetails.length,
            pendingTasks:taskDetails.length,
            completedTasks:0,
            priorityTasks:{
                High:highPriorityTasks.length,
                Medium:mediumPriorityTasks.length,
                Low:lowPriorityTasks.length
            },
            highPriorityTasks:taskDetails.filter(task=>(task.priority>7)),
            totalLoans:loans.length,
            totalLoanBalance:totalBalance,
            loans:loans,
            totalPrincipalBorrowed:0

    
    }})
}


