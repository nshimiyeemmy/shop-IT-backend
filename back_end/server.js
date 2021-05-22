const app = require('./app');
const connectToDatabase = require('./config/database');
//setting up the config file
require('dotenv').config({ path: 'back_end/config/config.env' });
const cloudinary = require('cloudinary');
//Handling the Uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`ERROR:${err.message}`);
  console.log('Shutting down due to uncaught Exceptions');
  process.exit(1);
});
//connecting to mongoDB database
connectToDatabase();

//setting up our cloudinary config for uploading the images
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const server = app.listen(process.env.PORT, () => {
  console.log(
    `server started on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  );
});
//Handling unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down the server due to UnHandled promise rejection');
  server.close(() => {
    process.exit(1);
  });
});
