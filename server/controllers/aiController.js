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
    const { resumeText, title } = req.body;
    const userId = req.userId;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const systemPrompt =
      "You are an expert AI Agent to extract data from resume.";

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
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });

    const extractedData = response.choices[0].message.content;
    const parsedData = JSON.parse(extractedData);
    const newResume = await Resume.create({ userId, title, ...parsedData });

    res.json({ resumeId: newResume._id });
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
        message: "Job title, company name and your name are required",
      });
    }

    // 3. Create the AI prompt
    // This is the INSTRUCTION we give to Groq AI
    const prompt = `Write a professional cover letter for the following details:
    
    Applicant Name: ${userName}
    Job Title applying for: ${jobTitle}
    Company Name: ${companyName}
    Key Skills: ${skills || "Not provided"}
    Years of Experience: ${experience || "Fresher"}
    
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

// ATS Score Analyzer
export const analyzeATS = async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    // Convert resume object to readable text for AI
    const resumeText = `
      Name: ${resumeData.personal_info?.name || ""}
      Email: ${resumeData.personal_info?.email || ""}
      Phone: ${resumeData.personal_info?.phone || ""}
      Location: ${resumeData.personal_info?.location || ""}
      
      Professional Summary: ${resumeData.professional_summary || ""}
      
      Skills: ${resumeData.skills?.join(", ") || ""}
      
      Experience: ${
        resumeData.experience
          ?.map((exp) => `${exp.title} at ${exp.company}: ${exp.description}`)
          .join("\n") || ""
      }
      
      Education: ${
        resumeData.education
          ?.map((edu) => `${edu.degree} from ${edu.institution}`)
          .join("\n") || ""
      }
      
      Projects: ${
        resumeData.project
          ?.map((p) => `${p.name}: ${p.description}`)
          .join("\n") || ""
      }
    `;

    // Build the AI prompt based on whether job description is provided
    const prompt = jobDescription
      ? `You are an expert ATS (Applicant Tracking System) analyzer.
        
        Analyze this resume against the job description and return ONLY a JSON object.
        
        RESUME:
        ${resumeText}
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        Return ONLY this JSON (no extra text):
        {
          "overall_score": <number 0-100>,
          "match_score": <number 0-100>,
          "sections": {
            "contact_info": <number 0-100>,
            "summary": <number 0-100>,
            "experience": <number 0-100>,
            "education": <number 0-100>,
            "skills": <number 0-100>
          },
          "matched_keywords": [<list of keywords from job desc found in resume>],
          "missing_keywords": [<list of important keywords from job desc missing in resume>],
          "strengths": [<3 specific strengths of this resume>],
          "improvements": [<3 specific things to improve>],
          "verdict": "<one line overall verdict>"
        }`
      : `You are an expert ATS (Applicant Tracking System) analyzer.
        
        Analyze this resume for general ATS compatibility and return ONLY a JSON object.
        
        RESUME:
        ${resumeText}
        
        Return ONLY this JSON (no extra text):
        {
          "overall_score": <number 0-100>,
          "sections": {
            "contact_info": <number 0-100>,
            "summary": <number 0-100>,
            "experience": <number 0-100>,
            "education": <number 0-100>,
            "skills": <number 0-100>
          },
          "strengths": [<3 specific strengths>],
          "improvements": [<3 specific improvements needed>],
          "verdict": "<one line overall verdict>"
        }`;

    // Send to Groq AI
    const result = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    // Parse the JSON response from AI
    let analysisText = result.choices[0].message.content;

    // Clean up response - remove markdown if AI adds it
    analysisText = analysisText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const analysis = JSON.parse(analysisText);

    res.json({ analysis });
  } catch (error) {
    console.error("ATS Analysis Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// AI Template Generator
export const generateTemplate = async (req, res) => {
  try {
    const { profession, colorScheme, style } = req.body;

    if (!profession) {
      return res.status(400).json({ message: "Profession is required" });
    }

    const prompt = `You are an expert resume designer. Create a complete, 
    professional HTML resume template for a ${profession}.
    
    Design Requirements:
    - Color scheme: ${colorScheme || "professional blue and white"}
    - Style: ${style || "modern and clean"}
    - Must be ATS friendly
    - Include these sections: Header, Professional Summary, Experience, Education, Skills
    - Use inline CSS only (no external stylesheets)
    - Use placeholder text like [Your Name], [Your Email], [Company Name] etc.
    - Make it visually impressive and industry-appropriate for ${profession}
    - For tech roles: use modern minimal design
    - For banking/finance: use formal conservative design  
    - For creative roles: use colorful modern design
    - For medical/teaching: use clean trustworthy design
    - The template should look UNIQUE and different from standard templates
    - Add subtle design elements like colored headers, dividers, icons using unicode
    - Make sure font sizes are readable (minimum 11px)
    - Page width should be 800px max
    - Add proper padding and spacing
    
    Return ONLY the complete HTML code starting with <!DOCTYPE html>.
    No explanation, no markdown, just pure HTML.`;

    const result = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 3000,
    });

    const templateHTML = result.choices[0].message.content
      .replace(/```html/g, "")
      .replace(/```/g, "")
      .trim();

    res.json({ templateHTML });
  } catch (error) {
    console.error("Template Generation Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Interview Question Generator
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { resumeData, jobTitle } = req.body;

    if (!resumeData) {
      return res.status(400).json({ message: "Resume data is required" });
    }

    // Convert resume to text
    const resumeText = `
      Name: ${resumeData.personal_info?.name || ""}
      Job Title: ${jobTitle || resumeData.experience?.[0]?.title || "Professional"}
      Skills: ${resumeData.skills?.join(", ") || ""}
      Experience: ${
        resumeData.experience
          ?.map((exp) => `${exp.title} at ${exp.company}: ${exp.description}`)
          .join("\n") || ""
      }
      Education: ${
        resumeData.education
          ?.map((edu) => `${edu.degree} from ${edu.institution}`)
          .join("\n") || ""
      }
      Projects: ${
        resumeData.project
          ?.map((p) => `${p.name}: ${p.description}`)
          .join("\n") || ""
      }
      Summary: ${resumeData.professional_summary || ""}
    `;

    const prompt = `You are an expert interview coach. Based on this resume, 
    generate realistic interview questions a candidate would face.
    
    RESUME:
    ${resumeText}
    
    Generate questions in these 4 categories and return ONLY valid JSON:
    {
      "candidate_name": "<name from resume>",
      "job_title": "<job title>",
      "technical": [
        {
          "question": "<technical question based on their specific skills>",
          "difficulty": "Easy/Medium/Hard",
          "tip": "<one line tip to answer this well>"
        }
      ],
      "behavioral": [
        {
          "question": "<behavioral/HR question>",
          "difficulty": "Easy/Medium/Hard", 
          "tip": "<one line tip using STAR method>"
        }
      ],
      "situational": [
        {
          "question": "<situational/scenario based question>",
          "difficulty": "Easy/Medium/Hard",
          "tip": "<one line tip>"
        }
      ],
      "resume_based": [
        {
          "question": "<specific question about something in their resume>",
          "difficulty": "Easy/Medium/Hard",
          "tip": "<one line tip>"
        }
      ]
    }
    
    Generate 4 questions per category (16 total).
    Make questions SPECIFIC to their actual skills and experience.
    Return ONLY the JSON, no extra text.`;

    const result = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    let responseText = result.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(responseText);
    res.json({ questions });
  } catch (error) {
    console.error("Interview Questions Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// RAG Bullet Suggestions (using Groq + Knowledge Base)
export const suggestBullets = async (req, res) => {
  try {
    const { bulletText, profession } = req.body;

    if (!bulletText) {
      return res.status(400).json({ message: "Bullet text is required" });
    }

    // Our knowledge base - stored directly (no Pinecone needed!)
    const knowledgeBase = {
      software_developer: [
        "Led development of microservices architecture serving 1M+ daily users",
        "Reduced API response time by 40% through caching and query optimization",
        "Built CI/CD pipeline reducing deployment time from 2 hours to 15 minutes",
        "Mentored team of 5 junior developers improving team velocity by 30%",
        "Developed React dashboard used by 500+ internal employees daily",
        "Implemented automated testing suite achieving 90% code coverage",
        "Architected scalable database schema handling 10M+ records efficiently",
        "Integrated payment gateway processing $2M+ monthly transactions",
      ],
      data_scientist: [
        "Built ML model predicting customer churn with 94% accuracy",
        "Analyzed 50GB dataset using Python reducing processing time by 60%",
        "Created real-time dashboard tracking KPIs for C-suite executives",
        "Developed NLP pipeline processing 100K+ customer reviews monthly",
        "Deployed recommendation engine increasing user engagement by 35%",
      ],
      marketing: [
        "Grew social media following from 10K to 100K in 6 months",
        "Managed $500K annual marketing budget achieving 3.5x ROI",
        "Launched email campaign achieving 45% open rate vs 21% industry average",
        "Reduced customer acquisition cost by 35% through targeted campaigns",
        "Led rebranding initiative resulting in 25% increase in brand awareness",
      ],
      sales: [
        "Exceeded annual sales quota by 140% generating $2.5M in revenue",
        "Built pipeline of 200+ qualified leads converting at 35% close rate",
        "Negotiated enterprise contracts averaging $150K ARR per client",
        "Expanded territory revenue by 60% within first year",
        "Retained 95% of existing accounts while growing new business by 40%",
      ],
      banking: [
        "Managed portfolio of 150+ HNI clients with combined AUM of $50M",
        "Reduced loan processing time by 30% through process automation",
        "Identified cost savings of $2M annually through financial analysis",
        "Ensured 100% regulatory compliance across all KYC/AML procedures",
        "Processed 500+ transactions daily maintaining zero error rate",
      ],
      teacher: [
        "Improved student pass rate from 72% to 94% through innovative teaching",
        "Developed curriculum for 3 new courses adopted by entire department",
        "Mentored 50+ students with 85% achieving academic excellence awards",
        "Integrated technology tools increasing student engagement by 40%",
        "Organized 10+ extracurricular activities improving school participation",
      ],
      hr: [
        "Reduced employee attrition by 25% through structured engagement programs",
        "Hired 100+ employees annually maintaining 95% retention rate",
        "Implemented HRMS system reducing administrative work by 40%",
        "Designed onboarding program reducing ramp-up time by 30%",
        "Conducted 200+ interviews maintaining quality hire rate of 90%",
      ],
      project_manager: [
        "Delivered 15+ projects on time and under budget with 98% client satisfaction",
        "Managed cross-functional team of 20+ across 3 time zones",
        "Reduced project delivery time by 25% through agile methodology",
        "Saved $500K by identifying and mitigating project risks early",
        "Coordinated with 10+ stakeholders ensuring alignment on project goals",
      ],
      general: [
        "Improved team productivity by 30% through process optimization",
        "Led cross-functional team of 10+ members to achieve quarterly targets",
        "Reduced operational costs by 20% through strategic planning",
        "Trained and mentored 15+ new team members successfully",
        "Achieved 98% customer satisfaction rating consistently",
        "Streamlined workflows reducing processing time by 35%",
        "Collaborated with senior leadership on strategic initiatives",
        "Generated $1M+ in cost savings through process improvements",
      ],
    };

    // Get relevant examples from knowledge base
    const professionKey =
      profession?.toLowerCase().replace(/ /g, "_") || "general";
    const examples = knowledgeBase[professionKey] || knowledgeBase.general;

    const prompt = `You are an expert resume writer. 
    
A user wrote this resume bullet point:
"${bulletText}"

Their profession: ${profession || "General Professional"}

Here are examples of EXCELLENT resume bullet points for reference:
${examples.map((b, i) => `${i + 1}. ${b}`).join("\n")}

Using these examples as inspiration and style guide, rewrite the user's bullet point in 5 different ways.
Each version should:
- Start with a strong action verb
- Include specific numbers/metrics where possible
- Be concise (one line maximum)
- Sound professional and impactful
- Be better than the original

Return ONLY valid JSON:
{
  "original": "${bulletText}",
  "suggestions": [
    {
      "text": "<improved bullet point 1>",
      "improvement": "<what makes this better in one sentence>"
    },
    {
      "text": "<improved bullet point 2>",
      "improvement": "<what makes this better>"
    },
    {
      "text": "<improved bullet point 3>",
      "improvement": "<what makes this better>"
    },
    {
      "text": "<improved bullet point 4>",
      "improvement": "<what makes this better>"
    },
    {
      "text": "<improved bullet point 5>",
      "improvement": "<what makes this better>"
    }
  ]
}

Return ONLY JSON, no extra text.`;

    const result = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1000,
    });

    let responseText = result.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const suggestions = JSON.parse(responseText);
    res.json({ suggestions });
  } catch (error) {
    console.error("Bullet Suggestions Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// LinkedIn PDF Import
export const importLinkedIn = async (req, res) => {
  try {
    const { pdfText, title } = req.body;

    if (!pdfText) {
      return res.status(400).json({ message: "PDF text is required" });
    }

    const prompt = `You are an expert resume parser specializing in LinkedIn profiles.
    
Extract ALL information from this LinkedIn PDF export and return a structured JSON.

LINKEDIN PDF CONTENT:
${pdfText}

Return ONLY this exact JSON structure (no extra text):
{
  "personal_info": {
    "name": "<full name>",
    "email": "<email if found>",
    "phone": "<phone if found>",
    "location": "<city, country>",
    "linkedin": "<linkedin URL if found>",
    "website": "<website if found>"
  },
  "professional_summary": "<write a 3-4 sentence professional summary based on their experience and skills>",
  "experience": [
    {
      "title": "<job title>",
      "company": "<company name>",
      "location": "<location>",
      "startDate": "<start date>",
      "endDate": "<end date or Present>",
      "description": "<responsibilities and achievements as bullet points>"
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<university/school name>",
      "startDate": "<start year>",
      "endDate": "<end year>"
    }
  ],
  "skills": [<array of skill strings>],
  "project": [
    {
      "name": "<project name>",
      "description": "<project description>",
      "link": "<project link if available>"
    }
  ]
}

Important rules:
- Extract EVERYTHING you can find
- If information is missing, use empty string ""
- For skills, extract ALL skills mentioned anywhere in the document
- Write professional_summary yourself based on their profile
- Return ONLY valid JSON, nothing else`;

    const result = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2000,
    });

    let responseText = result.choices[0].message.content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const extractedData = JSON.parse(responseText);

    // Save as new resume in database
    const Resume = (await import("../models/Resume.js")).default;

    // Fix: Convert description array to string if AI returns array
    const fixedExperience = extractedData.experience.map((exp) => ({
      ...exp,
      description: Array.isArray(exp.description)
        ? exp.description.join("\n") // join array into string
        : exp.description || "",
    }));

    // Fix: Same for projects
    const fixedProjects = extractedData.project.map((proj) => ({
      ...proj,
      description: Array.isArray(proj.description)
        ? proj.description.join("\n")
        : proj.description || "",
    }));

    const resume = await Resume.create({
      userId: req.userId,
      title: title || `${extractedData.personal_info.name}'s LinkedIn Resume`,
      personal_info: extractedData.personal_info,
      professional_summary: extractedData.professional_summary,
      experience: fixedExperience,
      education: extractedData.education,
      skills: extractedData.skills,
      project: fixedProjects,
    });

    res.json({
      message: "LinkedIn profile imported successfully!",
      resumeId: resume._id,
      extractedData,
    });
  } catch (error) {
    console.error("LinkedIn Import Error:", error);
    res.status(500).json({ message: error.message });
  }
};
