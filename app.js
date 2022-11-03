const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var ip = require("ip");

// CALLING ROUTES
const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");
const usersRoutes = require("./api/routes/users");
// CONNECTING TO DATABASE(MONGO DB)
mongoose.connect('mongodb+srv://rest-shop-api:' + process.env.MONGO_ATLAS_PW + '@rest-shop-api.efhlko2.mongodb.net/?retryWrites=true&w=majority')

//REQUEST LOGGER
app.use(morgan("dev")); 

// GETTING THE IP ADDRESS OF THE SERVER THROUGH WHICH HTTP REQUESTS CAN BE MADE TO THE API
// console.dir ( ip.address() );


// MAKING THE UPLOADS DIRECTORY ACCESSIBLE TO THE PUBLICr
app.use('/uploads', express.static('uploads'));

//ALLOWS REQUESTS TO PASS DATA TO THE API
app.use(bodyParser.urlencoded({extended: false})); 
app.use(bodyParser.json()); 

// DISABLING CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, DELETE, GET' )
        return res.status(200).json({})
    }
    next();
})

//LINKING AVAILABLE ROUTES
app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);
app.use("/users", usersRoutes);

// FIRST ERROR SETUP IS TO HANDLE REQUESTS THAT DON'T MAKE IT TO ANY OF THE MIDDLEWARE(ROUTES) ABOVE.
// IT LITERALLY JUST REGISTERS THE ERROR (PAGE NOT FOUND IN THIS CASE) AND PASSES IT TO THE SECOND SETUP BELOW
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error)
})

// THIS SECOND ERROR SETUP IS THE ERROR HANDLER, IT RETURNS AN ERROR RESPONSE FOR THE ERROR SETUP ABOVE 
// AND ALSE HANDLES AN OTHER INTERNAL SERVER ERRORS THAT MAY ARISE
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

module.exports = app;