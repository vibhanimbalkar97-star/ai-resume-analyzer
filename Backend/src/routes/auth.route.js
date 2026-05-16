const express = require('express')
const authRouter = express.Router()
const { registerUserController, loginUserController, logoutUserController} = require('../controllers/auth.controller.js')

/**
 * @route POST api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRouter.post("/register", registerUserController)

/**
 * @route POST api/auth/login
 * @desc Login user with email and password
 * @access Public
 */
authRouter.post("/login", loginUserController)

/**
 * @route GET api/auth/logout
 * @desc clear token from user cookie and add the token in blacklist
 * @access Public
 */
authRouter.get("/logout", logoutUserController)

module.exports = authRouter