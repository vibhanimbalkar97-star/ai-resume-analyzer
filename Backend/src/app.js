const express = require('express')
const app = express()
const authRouter = require("./routes/auth.route.js")
const errorHandler = require('./middlewares/error.middleware.js')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())

/* using all the routes here */
app.use("/api/auth", authRouter)

app.use(errorHandler)

module.exports = app