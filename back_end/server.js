const app = require('./app');

const connectToDatabase = require('./config/database');
//setting up the config file
 require('dotenv').config ({ path: 'back_end/config/config.env' });

//Handling the Uncaught exceptions
process.on('uncaughtException', err=>{
    console.log(`ERROR:${err.message}`);
    console.log("Shutting down due to uncaught Exceptions");
    process.exit(1);
})

//connecting to mongoDB database
connectToDatabase();

const server =  app.listen(process.env.PORT, ()=>{
    console.log(`server started on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})

//Handling unhandled promise rejections
process.on('unhandledRejection', err=>{
    console.log(`ERROR: ${err.message}`);
    console.log("Shutting down the server due to UnHandled promise rejection");
    server.close(()=>{
        process.exit(1)
    })
})
