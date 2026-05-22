const pdfParse = require("pdf-parse");
const generateInterviewreport = require("../services/ai.service.js");
const interviewReportModel = require("../models/interviewReport.model.js");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateInterviewReportController = async (req, res) => {
  const resumeFile = req.file;
  const resumeContent = pdfParse(req.file.buffer);
  const { selfDescription, jobDescription } = req.body;

  const interviewReportByAi = await generateInterviewreport({
    resume: resumeContent,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewReportModel.create({
    user: req.user.id,
    resume: resumeContent,
    selfDescription,
    jobDescription,
    ...interviewReportByAi,
  });

  res.status(201).json({
    message: "Interview report generated successfully",
  });
};

module.exports = generateInterviewReportController;
