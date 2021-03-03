const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next)=>{
    const env = process.env.NODE_ENV.trim()
    err.statusCode = err.statusCode || 500;

   if(env === "DEVELOPMENT"){
    res.status(err.statusCode).json({
        success:false,
        error:err,
        errMessage:err.message,
        stack:err.stack
    })
   }

   if (env === "PRODUCTION"){
       let error = {...err}
       error.message  = err.message

       // Handling Wrong Mongoose Object Id Errors
       if(err.name === 'CastError'){
           const message = `Resource not Found : Invalid ${err.path}`;
           error = new ErrorHandler(message,400);
       }

      //Handling Mongoose Validation Errors
      if(err.name === 'ValidationError'){
          const message = Object.values(err.errors).map(value =>value.message);
          error = new ErrorHandler(message,400);
      }

    res.status(error.statusCode).json({
        success:false,
        message: error.message || 'Internal Server Error'
    }) 
   }
   
}