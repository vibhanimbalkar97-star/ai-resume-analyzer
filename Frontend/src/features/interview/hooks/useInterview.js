import { useContext, useEffect } from "react";
import { InterviewContext } from "../interview.context";
import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
} from "./../services/interview.api";
import { useParams } from "react-router"

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error(
      "useInterview must be used within the an interviewProvider",
    );
  }

  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

    const {interviewId} = useParams()

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    let response = null;
    console.log("API response:", response);
    try {
       response = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(response.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    return response.interviewReport
  };

  const getReportById = async (interviewId) => {
    setLoading(true);
    let response = null;
    try {
       response = await getInterviewReportById(interviewId);
      setReport(response.interviewReport);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
    return response.interviewReport
  };

  const getReports = async () => {
    setLoading(true);
    let response=null
    try {
       response = await getAllInterviewReports();
       setReports(response.interviewReports)
       console.log("Reports data:", response.interviewReports);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
     return response.interviewReports
  };
  

  useEffect(() => {
    if(interviewId){
        getReportById(interviewId)
    } else {
        getReports()
    }
  }, [interviewId])

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getReports,
  };
};
