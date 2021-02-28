const app = require('./app');

//setting up the config file
const dotenv = require('dotenv');

dotenv.config ({ path: 'C:/Users/nshim/OneDrive/Desktop/2020/shop-IT/shop_IT/back_end/config/config.env' });

app.listen(process.env.PORT, ()=>{
    console.log(`server started on PORT ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})
