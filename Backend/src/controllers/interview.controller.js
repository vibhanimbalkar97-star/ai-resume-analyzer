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

module.exports = generateInterviewReportController;
