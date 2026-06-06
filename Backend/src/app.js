const express = require('express')
const app = express()
const authRouter = require("./routes/auth.route.js")
const interviewRouter = require("./routes/interview.route.js")

const errorHandler = require('./middlewares/error.middleware.js')
const cookieParser = require('cookie-parser')
const cors = require("cors")

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"https://ai-resume-analyzer-steel-six.vercel.app",
    credentials:true
}))

/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)


app.use(errorHandler)

module.exports = app