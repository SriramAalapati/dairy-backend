const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
  String(process.env.DB_Name),  // Database name
  String(process.env.DB_ADMIN_NAME),       // Username
  String(process.env.DB_PASSWORD),       // Password
  {
    host: String(process.env.DB_HOST),  // Azure SQL Server hostname
    dialect: 'mssql',  // Dialect for SQL Server (Microsoft SQL Server)
    dialectOptions: {
      encrypt: true,   // Ensures encryption for the connection to Azure SQL
    },
    pool: {
      max: 5,          // Maximum number of connections
      min: 0,          // Minimum number of connections
      acquire: 30000,  // Time (in ms) to wait before throwing an error
      idle: 10000,     // Time (in ms) to wait before closing an idle connection
    },
    logging:false,
  },
  
);
sequelize.authenticate().then(
    ()=>{
        console.log(
            "Database connected successfully"
        )
    }
)
.catch((err)=>console.log("Error connecting to database server",err))




module.exports = sequelize;
