const express = require('express')
const authRouter = express.Router()
const { registerUserController, loginUserController, logoutUserController, getMeController} = require('../controllers/auth.controller.js')
const authUser = require('../middlewares/auth.middleware.js')

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

/**
 * @route GET api/auth/get-me
 * @desc get the current logged in user details
 * @access Private
 */
authRouter.get("/get-me", authUser, getMeController)

module.exports = authRouter