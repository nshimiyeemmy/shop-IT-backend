const mongoose = require('mongoose');

const connectToDatabase = ()=>{
     mongoose.connect(process.env.DATABASE_URL,{
         useNewUrlParser:true,
         useUnifiedTopology:true,
         useCreateIndex:true,
     }).then(con => {
         console.log(`Database connected with HOST ${con.connection.host}`);
     })
     .catch(error => {
        console.log("Failed to Connect to the database"); 
      });
}
module.exports = connectToDatabase;