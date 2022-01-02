const app = require('./app');

const dotenv = require("dotenv");
const ConnectDatabase = require('./config/database')


// Handling uncaught Exception  we have to make this on top 
process.on("uncaughtException",(e)=>{
    console.log(`Error : ${e.message}`);
    console.log("Shutting down the server due to uncaught Exception")

    server.close(()=>{
        process.exit(1);
    });
})


// config
dotenv.config({path:"backend/config/config.env"})

// connecting to database 
ConnectDatabase();
const server = app.listen(process.env.PORT,()=>{
    console.log(`our server is working on http://localhost:${process.env.PORT}`)
})


// exit server due to unhandled rejections
process.on("unhandledRejection",(e)=>{
    console.log(`Error : ${e.message}`);
    console.log("Shutting down the server due to unhandled Rejections")

    server.close(()=>{
        process.exit(1);
    });
    
})