const mongoose = require('mongoose');

const connectToDatabase = ()=>{
     mongoose.connect('mongodb://localhost:27017/shop-IT',{
         useNewUrlParser:true,
         useUnifiedTopology:true,
         useCreateIndex:true,
     }).then(con => {
         console.log(`Database connected with host '${con.connection.host}'`);
     })
     .catch(error => {
        console.log("Failed to Connect to the database"); 
      });
}

module.exports = connectToDatabase;