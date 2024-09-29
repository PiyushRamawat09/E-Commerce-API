const app = require('./app');
const dotenv = require('dotenv');
const connectDatabse = require("./config/database");

// handling uncaught exception

process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
})

// config
dotenv.config({ path: "backend/config/config.env"});

// Connecting to Database

connectDatabse();

// database
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server is working on http://localhost:${process.env.PORT}`)
})

// console.log(youtube)

// unhandled promise rejections.

process.on("unhandledRejection", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Unhandled Promise Rejection`);
    server.close(() => {
        process.exit(1);
    });
})