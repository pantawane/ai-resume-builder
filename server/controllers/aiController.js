import Resume from "../models/Resume.js";
import ai from "../configs/ai.js";

//controller for enhanching a resume's professional summary
//POST: /api/ai/enhance-pro-sum



export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing.Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentances also highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for generating resume 's job description
//POST: /api/ai/generate-job-desc
export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing.Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentances also highlighting key responsibilities and achievements.Use action verbs and quantifiable results where possible. Make it ATS-friendly. and only return text no options or anything else.",
        },
        {
          role: "user",
          content: userContent,
        },
      ],
    });

    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//controller for uploading a resume to the database
//Post: /api/ai/upload-resume

export const uploadResume = async (req, res) => {
  try {

    const {resumeText, title} = req.body;
    const userId = req.userId;

    if(!resumeText){
        return res.status(400).json({message: 'Missing required fields'})
    }

    const systemPrompt = "You are an expert AI Agent to extract data from resume."

    const userPrompt = `extract data from this resume: ${resumeText}
    Provide data in the following JSON format with no additional text before or
    after:
    
    {
    professional_summary: {type: String, default: ''},
    skills: [{type: String}],
    personal_info: {
        image: {type: String, default: ''},
        full_name: {type: String, default: ''},
        profession: {type: String, default: ''},
        email: {type: String, default: ''},
        phone: {type: String, default: ''},
        location: {type: String, default: ''},
        linkedin: {type: String, default: ''},
        website: {type: String, default: ''},
    },
    experience: [
        {
            company: {type: String},
            position: {type: String},
            start_date: {type: String},
            end_date: {type: String},
            description: {type: String},
            is_current: {type: Boolean} ,
        }
    ],
    project: [
        {
            name: {type: String},
            type: {type: String},
            description: {type: String},
        }
    ],
    education: [
        {
            institution: {type: String},
            degree: {type: String},
            field: {type: String},
            graduation_date: {type: String},
            gpa: {type: String},
        }
    ],
    }
    `;

    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt},
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: {type: 'json_object'}
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData)
    const newResume = await Resume.create({userId, title, ...parsedData})

    res.json({resumeId: newResume._id})
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

// Cover Letter Generator
export const generateCoverLetter = async (req, res) => {
  try {
    // 1. Get data from frontend
    const { jobTitle, companyName, userName, skills, experience } = req.body;

    // 2. Validate - make sure required fields exist
    if (!jobTitle || !companyName || !userName) {
      return res.status(400).json({ 
        message: "Job title, company name and your name are required" 
      });
    }

    // 3. Create the AI prompt
    // This is the INSTRUCTION we give to Groq AI
    const prompt = `Write a professional cover letter for the following details:
    
    Applicant Name: ${userName}
    Job Title applying for: ${jobTitle}
    Company Name: ${companyName}
    Key Skills: ${skills || 'Not provided'}
    Years of Experience: ${experience || 'Fresher'}
    
    Instructions:
    - Write 3-4 paragraphs
    - First paragraph: Express interest in the role and company
    - Second paragraph: Highlight relevant skills and experience  
    - Third paragraph: Why they are perfect for this role
    - Fourth paragraph: Professional closing with call to action
    - Keep it under 300 words
    - Sound professional but human, NOT robotic
    - Do NOT use placeholder text like [Your Name] - use the actual name provided
    
    Write only the cover letter body, no subject line needed.`;

    // 4. Send to Groq AI (same pattern as your existing AI features)
    const result = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600,
    });

    // 5. Extract the text response
    const coverLetter = result.choices[0].message.content;

    // 6. Send back to frontend
    res.json({ coverLetter });

  } catch (error) {
    console.error("Cover Letter Error:", error);
    res.status(500).json({ message: error.message });
  }
};

