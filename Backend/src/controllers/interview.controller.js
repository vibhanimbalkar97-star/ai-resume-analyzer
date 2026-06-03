const pdfParse = require("pdf-parse");
const interviewReportModel = require("../models/interviewReport.model.js");
const asyncHandler = require("express-async-handler");
const generateInterviewReport = require("../services/ai.service.js");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateInterviewReportController = asyncHandler(async (req, res) => {
  const resumeContent = await new pdfParse.PDFParse(
    Uint8Array.from(req.file.buffer),
  ).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully",
    interviewReport,
  });
});

/**
 * @description Controller to get interview report by interviewId.
 */
const getInterviewReportByIdController = asyncHandler(async(req,res) => {
  const { interviewId } = req.params;

  const interviewReport = await interviewReportModel.findOne({_id:interviewId, user: req.user.id})

  if(!interviewReport){
    res.status(404)
    throw new Error("Interview report not found.")
  }

  res.status(200).json({
  message:"Interview report fetched successfully.",
    interviewReport
  })
})

/** 
 * @description Controller to get all interview reports of logged in user.
 */
const getAllInterviewReportsControllers = asyncHandler(async(req, res) => {
  const interviewReports = (await interviewReportModel.find({user: req.user.id})).toSorted({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
  res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
})

module.exports ={ generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsControllers
}
