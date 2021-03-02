const ErrorHandler = require('../utils/errorHandler');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    
    if(process.env.NODE_DEV == 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success:false,
            error:err,
            errMessage:err.message,
            stack:err.stack
        })
    }
     if(process.env.NODE_DEV == 'PRODUCTION'){
        let error = {...err}
        error.message = err.message

        res.status(error.statusCode).json({
            success:false,
            message:error.message || 'Internal Server Error' 
        })

    }
}