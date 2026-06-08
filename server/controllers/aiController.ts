import { Response } from 'express';
import ai from '../configs/ai.js';
import { AuthRequest } from '../types/index.js';

interface ExperienceItem {
  title?: string;
  company?: string;
  description?: string;
}

interface EducationItem {
  degree?: string;
  institution?: string;
}

interface ProjectItem {
  name?: string;
  description?: string | string[];
}

interface ResumeData {
  personal_info?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
  };
  professional_summary?: string;
  skills?: string[];
  experience?: ExperienceItem[];
  education?: EducationItem[];
  project?: ProjectItem[];
}

interface KnowledgeBase {
  [key: string]: string[];
}

// Enhance Professional Summary
export const enhanceProfessionalSummary = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userContent } = req.body;

  if (!userContent) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [
      {
        role: 'system',
        content: 'You are an expert in resume writing. Your task is to enhance the professional summary of a resume. The summary should be 1-2 sentences highlighting key skills, experience, and career objectives. Make it compelling and ATS-friendly. Return only text.',
      },
      { role: 'user', content: userContent },
    ],
  });

  const enhancedContent = response.choices[0].message.content;
  res.status(200).json({ enhancedContent });
};

// Enhance Job Description
export const enhanceJobDescription = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { userContent } = req.body;

  if (!userContent) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [
      {
        role: 'system',
        content: 'You are an expert in resume writing. Enhance the job description in 1-2 sentences highlighting key responsibilities and achievements. Use action verbs and quantifiable results. Make it ATS-friendly. Return only text.',
      },
      { role: 'user', content: userContent },
    ],
  });

  const enhancedContent = response.choices[0].message.content;
  res.status(200).json({ enhancedContent });
};

// Upload Resume via PDF
export const uploadResume = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { resumeText, title } = req.body;
  const userId = req.userId;

  if (!resumeText) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  const systemPrompt = 'You are an expert AI Agent to extract data from resume.';
  const userPrompt = `extract data from this resume: ${resumeText}
  Provide data in the following JSON format with no additional text before or after:
  {
    "professional_summary": "",
    "skills": [],
    "personal_info": { "image": "", "full_name": "", "profession": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
    "experience": [{ "company": "", "position": "", "start_date": "", "end_date": "", "description": "", "is_current": false }],
    "project": [{ "name": "", "type": "", "description": "" }],
    "education": [{ "institution": "", "degree": "", "field": "", "graduation_date": "", "gpa": "" }]
  }`;

  const response = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
  });

  const extractedData = response.choices[0].message.content as string;
  const parsedData = JSON.parse(extractedData);

  const Resume = (await import('../models/Resume.js')).default;
 // ✅ CORRECT
  const newResume = await Resume.create({ userId, title, ...parsedData }) as any;
  res.json({ resumeId: newResume._id?.toString() });
};

// Generate Cover Letter
export const generateCoverLetter = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { jobTitle, companyName, userName, skills, experience } = req.body;

  if (!jobTitle || !companyName || !userName) {
    res.status(400).json({ message: 'Job title, company name and your name are required' });
    return;
  }

  const prompt = `Write a professional cover letter for:
  Applicant Name: ${userName}
  Job Title: ${jobTitle}
  Company: ${companyName}
  Skills: ${skills || 'Not provided'}
  Experience: ${experience || 'Fresher'}
  Instructions:
  - Write 3-4 paragraphs
  - Keep under 300 words
  - Sound professional but human
  - Use the actual name provided
  Write only the cover letter body.`;

  const result = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
  });

  const coverLetter = result.choices[0].message.content;
  res.json({ coverLetter });
};

// Analyze ATS Score
export const analyzeATS = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { resumeData, jobDescription }: { resumeData: ResumeData; jobDescription?: string } = req.body;

  if (!resumeData) {
    res.status(400).json({ message: 'Resume data is required' });
    return;
  }

  const resumeText = `
    Name: ${resumeData.personal_info?.name || ''}
    Email: ${resumeData.personal_info?.email || ''}
    Phone: ${resumeData.personal_info?.phone || ''}
    Location: ${resumeData.personal_info?.location || ''}
    Summary: ${resumeData.professional_summary || ''}
    Skills: ${resumeData.skills?.join(', ') || ''}
    Experience: ${resumeData.experience?.map((e) => `${e.title} at ${e.company}: ${e.description}`).join('\n') || ''}
    Education: ${resumeData.education?.map((e) => `${e.degree} from ${e.institution}`).join('\n') || ''}
    Projects: ${resumeData.project?.map((p) => `${p.name}: ${p.description}`).join('\n') || ''}
  `;

  const prompt = jobDescription
    ? `Analyze this resume against the job description. Return ONLY JSON:
      RESUME: ${resumeText}
      JOB DESCRIPTION: ${jobDescription}
      {
        "overall_score": <0-100>, "match_score": <0-100>,
        "sections": { "contact_info": <0-100>, "summary": <0-100>, "experience": <0-100>, "education": <0-100>, "skills": <0-100> },
        "matched_keywords": [], "missing_keywords": [], "strengths": [], "improvements": [], "verdict": ""
      }`
    : `Analyze this resume for ATS compatibility. Return ONLY JSON:
      RESUME: ${resumeText}
      {
        "overall_score": <0-100>,
        "sections": { "contact_info": <0-100>, "summary": <0-100>, "experience": <0-100>, "education": <0-100>, "skills": <0-100> },
        "strengths": [], "improvements": [], "verdict": ""
      }`;

  const result = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
  });

  const analysisText = (result.choices[0].message.content as string)
    .replace(/```json/g, '').replace(/```/g, '').trim();

  const analysis = JSON.parse(analysisText);
  res.json({ analysis });
};

// Generate AI Template
export const generateTemplate = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { profession, colorScheme, style } = req.body;

  if (!profession) {
    res.status(400).json({ message: 'Profession is required' });
    return;
  }

  const prompt = `Create a complete professional HTML resume template for a ${profession}.
  Color scheme: ${colorScheme || 'professional blue and white'}
  Style: ${style || 'modern and clean'}
  - ATS friendly, inline CSS only, placeholder text like [Your Name]
  - Minimum 11px font, max 800px width
  Return ONLY complete HTML starting with <!DOCTYPE html>.`;

  const result = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
  });

  const templateHTML = (result.choices[0].message.content as string)
    .replace(/```html/g, '').replace(/```/g, '').trim();

  res.json({ templateHTML });
};

// Generate Interview Questions
export const generateInterviewQuestions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { resumeData, jobTitle }: { resumeData: ResumeData; jobTitle?: string } = req.body;

  if (!resumeData) {
    res.status(400).json({ message: 'Resume data is required' });
    return;
  }

  const resumeText = `
    Name: ${resumeData.personal_info?.name || ''}
    Job Title: ${jobTitle || resumeData.experience?.[0]?.title || 'Professional'}
    Skills: ${resumeData.skills?.join(', ') || ''}
    Experience: ${resumeData.experience?.map((e) => `${e.title} at ${e.company}: ${e.description}`).join('\n') || ''}
    Education: ${resumeData.education?.map((e) => `${e.degree} from ${e.institution}`).join('\n') || ''}
    Summary: ${resumeData.professional_summary || ''}
  `;

  const prompt = `Generate interview questions based on this resume. Return ONLY JSON:
  RESUME: ${resumeText}
  {
    "candidate_name": "", "job_title": "",
    "technical": [{ "question": "", "difficulty": "Easy/Medium/Hard", "tip": "" }],
    "behavioral": [{ "question": "", "difficulty": "Easy/Medium/Hard", "tip": "" }],
    "situational": [{ "question": "", "difficulty": "Easy/Medium/Hard", "tip": "" }],
    "resume_based": [{ "question": "", "difficulty": "Easy/Medium/Hard", "tip": "" }]
  }
  Generate 4 questions per category. Return ONLY JSON.`;

  const result = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
  });

  const responseText = (result.choices[0].message.content as string)
    .replace(/```json/g, '').replace(/```/g, '').trim();

  const questions = JSON.parse(responseText);
  res.json({ questions });
};

// Suggest Bullet Points (RAG)
export const suggestBullets = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { bulletText, profession } = req.body;

  if (!bulletText) {
    res.status(400).json({ message: 'Bullet text is required' });
    return;
  }

  const knowledgeBase: KnowledgeBase = {
    software_developer: [
      'Led development of microservices architecture serving 1M+ daily users',
      'Reduced API response time by 40% through caching and query optimization',
      'Built CI/CD pipeline reducing deployment time from 2 hours to 15 minutes',
      'Mentored team of 5 junior developers improving team velocity by 30%',
      'Developed React dashboard used by 500+ internal employees daily',
      'Implemented automated testing suite achieving 90% code coverage',
    ],
    data_scientist: [
      'Built ML model predicting customer churn with 94% accuracy',
      'Analyzed 50GB dataset using Python reducing processing time by 60%',
      'Created real-time dashboard tracking KPIs for C-suite executives',
      'Developed NLP pipeline processing 100K+ customer reviews monthly',
    ],
    marketing: [
      'Grew social media following from 10K to 100K in 6 months',
      'Managed $500K annual marketing budget achieving 3.5x ROI',
      'Launched email campaign achieving 45% open rate vs 21% industry average',
      'Reduced customer acquisition cost by 35% through targeted campaigns',
    ],
    sales: [
      'Exceeded annual sales quota by 140% generating $2.5M in revenue',
      'Built pipeline of 200+ qualified leads converting at 35% close rate',
      'Negotiated enterprise contracts averaging $150K ARR per client',
      'Expanded territory revenue by 60% within first year',
    ],
    banking: [
      'Managed portfolio of 150+ HNI clients with combined AUM of $50M',
      'Reduced loan processing time by 30% through process automation',
      'Identified cost savings of $2M annually through financial analysis',
      'Ensured 100% regulatory compliance across all KYC/AML procedures',
    ],
    teacher: [
      'Improved student pass rate from 72% to 94% through innovative teaching',
      'Developed curriculum for 3 new courses adopted by entire department',
      'Mentored 50+ students with 85% achieving academic excellence awards',
      'Integrated technology tools increasing student engagement by 40%',
    ],
    hr: [
      'Reduced employee attrition by 25% through structured engagement programs',
      'Hired 100+ employees annually maintaining 95% retention rate',
      'Implemented HRMS system reducing administrative work by 40%',
    ],
    project_manager: [
      'Delivered 15+ projects on time and under budget with 98% client satisfaction',
      'Managed cross-functional team of 20+ across 3 time zones',
      'Reduced project delivery time by 25% through agile methodology',
      'Saved $500K by identifying and mitigating project risks early',
    ],
    general: [
      'Improved team productivity by 30% through process optimization',
      'Led cross-functional team of 10+ members to achieve quarterly targets',
      'Reduced operational costs by 20% through strategic planning',
      'Trained and mentored 15+ new team members successfully',
      'Achieved 98% customer satisfaction rating consistently',
    ],
  };

  const professionKey = profession?.toLowerCase().replace(/ /g, '_') || 'general';
  const examples: string[] = knowledgeBase[professionKey] || knowledgeBase['general'];

  const prompt = `You are an expert resume writer.
  User's bullet: "${bulletText}"
  Profession: ${profession || 'General'}
  Reference examples:
  ${examples.map((b, i) => `${i + 1}. ${b}`).join('\n')}

  Rewrite in 5 different ways. Return ONLY JSON:
  {
    "original": "${bulletText}",
    "suggestions": [
      { "text": "", "improvement": "" },
      { "text": "", "improvement": "" },
      { "text": "", "improvement": "" },
      { "text": "", "improvement": "" },
      { "text": "", "improvement": "" }
    ]
  }`;

  const result = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
  });

  const responseText = (result.choices[0].message.content as string)
    .replace(/```json/g, '').replace(/```/g, '').trim();

  const suggestions = JSON.parse(responseText);
  res.json({ suggestions });
};

// Import LinkedIn PDF
export const importLinkedIn = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { pdfText, title } = req.body;

  if (!pdfText) {
    res.status(400).json({ message: 'PDF text is required' });
    return;
  }

  const prompt = `Extract ALL information from this LinkedIn PDF. Return ONLY JSON:
  LINKEDIN PDF: ${pdfText}
  {
    "personal_info": { "name": "", "email": "", "phone": "", "location": "", "linkedin": "", "website": "" },
    "professional_summary": "",
    "experience": [{ "title": "", "company": "", "location": "", "startDate": "", "endDate": "", "description": "" }],
    "education": [{ "degree": "", "institution": "", "startDate": "", "endDate": "" }],
    "skills": [],
    "project": [{ "name": "", "description": "", "link": "" }]
  }
  Return ONLY valid JSON.`;

  const result = await ai.chat.completions.create({
    model: process.env.OPENAI_MODEL as string,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 2000,
  });

  const responseText = (result.choices[0].message.content as string)
    .replace(/```json/g, '').replace(/```/g, '').trim();

  const extractedData = JSON.parse(responseText);

  const fixedExperience = extractedData.experience.map((exp: ExperienceItem) => ({
    ...exp,
    description: Array.isArray(exp.description)
      ? (exp.description as string[]).join('\n')
      : exp.description || '',
  }));

  const fixedProjects = extractedData.project.map((proj: ProjectItem) => ({
    ...proj,
    description: Array.isArray(proj.description)
      ? (proj.description as string[]).join('\n')
      : proj.description || '',
  }));

  const ResumeModel = (await import('../models/Resume.js')).default;
  const resume = await ResumeModel.create({
    userId: req.userId,
    title: title || `${extractedData.personal_info.name}'s LinkedIn Resume`,
    personal_info: extractedData.personal_info,
    professional_summary: extractedData.professional_summary,
    experience: fixedExperience,
    education: extractedData.education,
    skills: extractedData.skills,
    project: fixedProjects,
  }) as any;

  res.json({
    message: 'LinkedIn profile imported successfully!',
    resumeId: resume._id,
    extractedData,
  });
};