# 🚀 AI Resume Generator

> A full-stack AI-powered resume builder that helps job seekers create professional resumes, track applications, and prepare for interviews — completely free!

![AI Resume Generator](https://img.shields.io/badge/Stack-MERN-green) ![AI](https://img.shields.io/badge/AI-Groq%20LLaMA-blue) ![License](https://img.shields.io/badge/License-MIT-yellow) ![Status](https://img.shields.io/badge/Status-Live-brightgreen)

---

## ✨ Features

### 📄 Resume Builder
- **4 Professional Templates** — Classic, Modern, Minimal, Minimal with Image
- **AI-Powered Content** — Enhance professional summary and job descriptions with AI
- **Real-time Preview** — See changes instantly as you type
- **10 Accent Colors** — Customize your resume's color scheme
- **Profile Photo Upload** — With AI background removal powered by ImageKit
- **PDF Download** — Download your resume as a professional PDF
- **Public Sharing** — Share your resume via a unique public link

### 🤖 AI Features
- **Cover Letter Generator** — AI writes personalized cover letters in seconds
- **ATS Score Analyzer** — Check how well your resume passes ATS filters
- **Job Description Matcher** — Match your resume against any job description
- **AI Template Generator** — Generate unlimited templates for any profession
- **Interview Prep** — Get 16 personalized interview questions based on your resume
- **Bullet AI Suggestions** — Improve weak bullet points with AI-powered rewrites
- **LinkedIn PDF Import** — Upload LinkedIn PDF and AI fills your entire resume

### 📋 Job Tracker
- **Kanban Board** — Track applications across Applied, Interview, Offer, Rejected
- **Application Stats** — See your job search progress at a glance
- **Notes & Details** — Add salary, location, job URL, and notes
- **One-click Status Move** — Move applications between columns instantly

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| Vite | Build Tool |
| Redux Toolkit | State Management |
| React Router | Navigation |
| Tailwind CSS | Styling |
| Axios | API Calls |
| React Hot Toast | Notifications |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 5 | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Bcrypt | Password Hashing |
| Multer | File Upload |
| ImageKit | Image CDN |

### AI & Services
| Service | Purpose |
|---|---|
| Groq (LLaMA 3.3) | AI Text Generation |
| ImageKit | Image Storage & Background Removal |
| MongoDB Atlas | Cloud Database |
| Vercel | Deployment |

---

## 📁 Project Structure

```
Resume generator/
├── client/                          # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Dashboard.jsx        # Resume dashboard
│   │   │   ├── ResumeBuilder.jsx    # Resume editor
│   │   │   ├── CoverLetter.jsx      # Cover letter generator
│   │   │   ├── ATSScore.jsx         # ATS analyzer
│   │   │   ├── TemplateGenerator.jsx # AI template generator
│   │   │   ├── InterviewPrep.jsx    # Interview questions
│   │   │   ├── BulletSuggestions.jsx # Bullet point AI
│   │   │   ├── LinkedInImport.jsx   # LinkedIn PDF import
│   │   │   ├── JobTracker.jsx       # Job application tracker
│   │   │   └── Preview.jsx          # Public resume view
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── PersonalInfoForm.jsx
│   │   │   ├── ExperienceForm.jsx
│   │   │   ├── EducationForm.jsx
│   │   │   ├── SkillsForm.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── TemplateSelector.jsx
│   │   │   ├── ColorPicker.jsx
│   │   │   └── templates/
│   │   │       ├── ClassicTemplate.jsx
│   │   │       ├── ModernTemplate.jsx
│   │   │       ├── MinimalTemplate.jsx
│   │   │       └── MinimalImageTemplate.jsx
│   │   ├── app/
│   │   │   ├── store.js
│   │   │   └── features/authSlice.js
│   │   └── configs/
│   │       └── api.js
│   └── .env
│
└── server/                          # Node.js Backend
    ├── configs/
    │   ├── ai.js                    # Groq AI config
    │   ├── db.js                    # MongoDB config
    │   ├── imagekit.js              # ImageKit config
    │   └── multer.js                # File upload config
    ├── controllers/
    │   ├── aiController.js          # All AI features
    │   ├── jobController.js         # Job tracker CRUD
    │   ├── resumeController.js      # Resume CRUD
    │   └── UserControllers.js       # Auth & user
    ├── middleware/
    │   └── authMiddleware.js        # JWT protection
    ├── models/
    │   ├── JobApplication.js        # Job tracker model
    │   ├── Resume.js                # Resume model
    │   └── User.js                  # User model
    ├── routes/
    │   ├── aiRoutes.js
    │   ├── jobRoutes.js
    │   ├── resumeRoutes.js
    │   └── userRoutes.js
    ├── server.js
    └── .env
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at console.groq.com)
- ImageKit account (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/pantawane/ai-resume-builder.git
cd ai-resume-builder
```

### 2. Setup Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
JWT_SECRET=your_strong_secret_here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-builder
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
OPENAI_API_KEY=your_groq_api_key
OPENAI_BASE_URL=https://api.groq.com/openai/v1
OPENAI_MODEL=llama-3.3-70b-versatile
```

Start the server:

```bash
npm run server
```

You should see:
```
Server running on port 5000
MongoDB connected
```

### 3. Setup Client

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_BASE_URL=http://localhost:5000
```

Start the client:

```bash
npm run dev
```

Open **http://localhost:5173** in your browser! 🎉

---

## 🔑 Getting API Keys

### Groq API (Free)
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up → API Keys → Create key
3. Copy key starting with `gsk_...`

### ImageKit (Free Tier)
1. Go to [imagekit.io](https://imagekit.io)
2. Sign up → Settings → API Keys
3. Copy Private Key

### MongoDB Atlas (Free)
1. Go to [mongodb.com/atlas](https://cloud.mongodb.com)
2. Create free M0 cluster
3. Network Access → Allow `0.0.0.0/0`
4. Get connection string

---

## 🚀 Deployment (Vercel)

### Deploy Server
```bash
cd server
vercel --prod
```

### Deploy Client
Update `client/.env`:
```env
VITE_BASE_URL=https://your-server.vercel.app
```

```bash
cd client
vercel --prod
```

Add all environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/users/register` | Register new user |
| POST | `/api/users/login` | Login user |
| GET | `/api/users/data` | Get current user |
| GET | `/api/users/resumes` | Get user's resumes |

### Resumes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/resumes/create` | Create new resume |
| PUT | `/api/resumes/update` | Update resume |
| DELETE | `/api/resumes/delete/:id` | Delete resume |
| GET | `/api/resumes/get/:id` | Get resume (protected) |
| GET | `/api/resumes/public/:id` | Get resume (public) |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/ai/enhance-pro-sum` | Enhance professional summary |
| POST | `/api/ai/enhance-job-desc` | Enhance job description |
| POST | `/api/ai/upload-resume` | Parse PDF resume |
| POST | `/api/ai/cover-letter` | Generate cover letter |
| POST | `/api/ai/analyze-ats` | ATS score analysis |
| POST | `/api/ai/generate-template` | Generate AI template |
| POST | `/api/ai/interview-questions` | Generate interview questions |
| POST | `/api/ai/suggest-bullets` | Suggest bullet improvements |
| POST | `/api/ai/import-linkedin` | Import LinkedIn PDF |

### Job Tracker
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/jobs/all` | Get all job applications |
| POST | `/api/jobs/add` | Add new application |
| PUT | `/api/jobs/update` | Update application |
| DELETE | `/api/jobs/delete/:id` | Delete application |

---

## 🆚 Why Choose This Over Competitors?

| Feature | This App | Zety | Resume.io | Kickresume |
|---|---|---|---|---|
| AI Templates | ✅ Free | ❌ | ❌ | ❌ |
| ATS Scorer | ✅ Free | 💰 Paid | ❌ | 💰 Paid |
| Interview Prep | ✅ Free | ❌ | ❌ | ❌ |
| Bullet AI | ✅ Free | ❌ | ❌ | ❌ |
| LinkedIn Import | ✅ Free | 💰 Paid | 💰 Paid | 💰 Paid |
| Cover Letter | ✅ Free | 💰 Paid | 💰 Paid | 💰 Paid |
| Job Tracker | ✅ Free | ❌ | ❌ | ❌ |
| Open Source | ✅ Yes | ❌ | ❌ | ❌ |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Vansh Pantawane**

- GitHub: [@pantawane](https://github.com/pantawane)
- LinkedIn: [Vansh Pantawane](https://linkedin.com/in/pantawane)

---

## ⭐ Show Your Support

If this project helped you, please give it a **⭐ star** on GitHub!

---

*Built with ❤️ using MERN Stack + AI*#   C I / C D   T e s t  
 