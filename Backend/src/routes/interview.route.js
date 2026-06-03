const express = require("express");
const authUser = require("../middlewares/auth.middleware.js");
const upload = require("../middlewares/file.middleware.js");
const {generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsControllers} = require("../controllers/interview.controller.js");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @desc generate new interview report on the basis of user self desc, resume(pdf), job desc
 * @access private
 */
interviewRouter.post(
  "/",
  authUser,
  upload.single("resume"),
  generateInterviewReportController,
);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc get interview report by interviewId.
 * @access private
 */
interviewRouter.get("/report/:interviewId", authUser, generateInterviewReportController)

/**
 * @route GET /api/interview/
 * @description get all interview reports of logged in user.
 * @access private
 */
interviewRouter.get("/", authUser, getAllInterviewReportsControllers)

module.exports = interviewRouter;
