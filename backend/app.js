const express = require('express')
const app = express();

// we use cookie parser 
const cookieParser = require("cookie-parser")

app.use(express.json());
// use cookie parser 
app.use(cookieParser())


// middleware import

const ErrorMiddleWare = require("./middleware/error")
const isAuthenticated = require("./middleware/isAuthenticated")

// routes import
const product = require("./routes/productRoute")
const user = require('./routes/userRoute')

// routes---
app.use("/api/v1",product)

app.use("/api/v1",user)


// error middleware 
app.use(ErrorMiddleWare)

module.exports = app

