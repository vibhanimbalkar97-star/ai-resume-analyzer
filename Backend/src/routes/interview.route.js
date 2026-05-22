const express = require("express");
const authUser = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/file.middleware.js");
const generateInterviewReportController = require("../controllers/interview.controller.js");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @desc generate new interview report on the basis of user self desc, resume(pdf), job desc
 * @access private
 */
interviewRouter.post("/", authUser, upload.single("resume"), generateInterviewReportController);

module.exports = interviewRouter;
