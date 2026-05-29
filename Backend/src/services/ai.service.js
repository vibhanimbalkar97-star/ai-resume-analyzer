const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const interviewReportSchema = z
  .object({
    matchScore: z
      .number()
      .min(0)
      .max(100)
      .describe(
        "A score between 0 and 100 indicating how well the candidate's profile matches the job describe",
      ),
    technicalQuestions: z
      .array(
        z
          .object({
            question: z
              .string()
              .min(1, "Question is required")
              .describe("The technical question can be asked in the interview"),
            intention: z
              .string()
              .min(1, "Intention is required")
              .describe(
                "The intention of interviewer behind asking this question",
              ),
            answer: z
              .string()
              .min(1, "Answer is required")
              .describe(
                "How to answer this question, what points to cover, what approach to take etc.",
              ),
          })
          .strict(),
      )
      .length(5)
      .describe(
        "Technical questions that can be asked in the interview along with their intention and how to answer them",
      ),
    behavioralQuestions: z
      .array(
        z
          .object({
            question: z
              .string()
              .min(1, "Question is required")
              .describe(
                "The behavioral question can be asked in the interview",
              ),
            intention: z
              .string()
              .min(1, "Intention is required")
              .describe(
                "The intention of interviewer behind asking this question",
              ),
            answer: z
              .string()
              .min(1, "Answer is required")
              .describe(
                "How to answer this question, what points to cover, what approach to take etc.",
              ),
          })
          .strict(),
      )
      .length(3)
      .describe(
        "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
      ),
    skillGaps: z
      .array(
        z
          .object({
            skill: z
              .string()
              .min(1, "Skill is required")
              .describe("The skill which the candidate is lacking"),
            severity: z
              .enum(["low", "medium", "high"])
              .describe(
                "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances",
              ),
          })
          .strict(),
      )
      .length(3)
      .describe(
        "List of skill gaps in the candidate's profile along with their severity",
      ),
    preparationPlan: z
      .array(
        z
          .object({
            day: z
              .number()
              .min(1)
              .max(7)
              .describe(
                "The day number in the preparation plan, starting from 1",
              ),
            focus: z
              .string()
              .min(1, "Focus is required")
              .describe(
                "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc.",
              ),
            tasks: z
              .array(z.string())
              .min(1, "Task is required")
              .describe(
                "List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.",
              ),
          })
          .strict(),
      )
      .length(7)
      .describe(
        "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
      ),
  })
  .strict();

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are a technical interviewer.

Analyze the resume and job description.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Return ONLY valid JSON.

IMPORTANT RULES:

1. technicalQuestions MUST contain EXACTLY 5 objects
2. behavioralQuestions MUST contain EXACTLY 3 objects
3. skillGaps MUST contain EXACTLY 3 objects
4. preparationPlan MUST contain EXACTLY 7 objects

5. Use ONLY these keys.

technicalQuestions object:
{
  "question": "",
  "intention": "",
  "answer": ""
}

behavioralQuestions object:
{
  "question": "",
  "intention": "",
  "answer": ""
}

skillGaps object:
{
  "skill": "",
  "severity": "low"
}

preparationPlan object:
{
  "day": 1,
  "focus": "",
  "tasks": ["", ""]
}

6. DO NOT use these keys:
id
difficulty
expectedAnswer
reason
title
area

7. matchScore must be a number

8. severity must ONLY be:
low
medium
high

9. tasks must always be array of strings

10. Return ONLY raw JSON
11. No markdown
12. No explanations
13. No comments
Each technicalQuestions and behavioralQuestions object MUST contain:
- question
- intention
- answer

answer must contain at least 2-3 sentences.
answer cannot be empty.
`;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  let lastError = null;
  let result;

  for (let i = 0; i < 3; i++) {
    try {
      if (i > 0) {
        await sleep(2000 * i);
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      try {
        result = JSON.parse(response.text);
        console.log("AI RESULT", result);
      } catch {
        throw new Error("Invalid JSON returned by AI");
      }
      const parsed = interviewReportSchema.safeParse(result);
if (parsed.success) {
  return parsed.data;
}

console.log(parsed.error.flatten());

throw new Error("Schema validation failed");
    } catch (err) {
      lastError = err;

      console.log(`Retry ${i + 1}:`, err.message);
    }
  }

  throw new Error(lastError?.message || "Gemini unavailable");
}

module.exports = generateInterviewReport;
