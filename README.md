# 🚀 AI Resume Generator

> A full-stack AI-powered resume platform that helps job seekers create professional resumes, track applications, prepare for interviews, and beat ATS systems — completely free!

![Stack](https://img.shields.io/badge/Stack-MERN-green)
![AI](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Zero%20Errors-blue)
![Tests](https://img.shields.io/badge/Tests-17%2F17%20Passing-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## ✨ Features

### 📄 Resume Builder
- **4 Professional Templates** — Classic, Modern, Minimal, Minimal with Image
- **Real-time Preview** — See changes instantly as you type
- **10 Accent Colors** — Customize your resume color scheme
- **Profile Photo Upload** — With AI background removal powered by ImageKit
- **PDF Download** — Download as professional PDF via browser print
- **Public Sharing** — Share resume via unique public link or Web Share API
- **Public/Private Toggle** — Control who can see your resume

### 🤖 AI Features (Powered by Groq LLaMA 3.3)
- **Cover Letter Generator** — AI writes personalized cover letters in seconds
- **ATS Score Analyzer** — Check how well your resume passes ATS filters (0-100 score)
- **Job Description Matcher** — Match your resume against any job description with keyword analysis
- **AI Template Generator** — Generate unlimited profession-specific templates (Tech, Banking, Teaching, MBA etc.)
- **Interview Prep** — Get 16 personalized interview questions across 4 categories based on YOUR resume
- **Bullet AI Suggestions** — Improve weak bullet points with 5 AI-powered rewrites
- **LinkedIn PDF Import** — Upload LinkedIn PDF → AI fills entire resume automatically
- **PDF Resume Upload** — Upload any PDF resume → AI extracts and fills all sections

### 📋 Job Application Tracker
- **Kanban Board** — Track applications: Applied → Interview → Offer → Rejected
- **Application Stats** — Real-time counts per status
- **Full Details** — Company, position, salary, location, job URL, notes
- **One-click Status Move** — Move between columns instantly
- **Edit & Delete** — Full CRUD for all applications

---

## 🛡️ Production-Ready Features

- **Rate Limiting** — Auth: 10 req/15min, AI: 20 req/hour, General: 100 req/15min
- **Security Headers** — Helmet.js with 15 security headers
- **Request Logging** — Morgan HTTP logger
- **Global Error Handler** — Catches all errors with proper HTTP status codes
- **JWT Authentication** — 7-day tokens, Bearer scheme
- **Input Validation** — Server-side validation on all endpoints
- **Docker** — Full containerization with docker-compose
- **CI/CD** — GitHub Actions auto-deploys on every push
- **TypeScript** — Zero errors across all server files
- **Jest Tests** — 17/17 unit tests passing

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.2.0 | UI Framework |
| Vite | 7.2.4 | Build Tool |
| Redux Toolkit | 2.11.2 | State Management |
| React Router | 7.10.1 | Navigation |
| Tailwind CSS | 4.1.17 | Styling |
| Axios | 1.13.2 | HTTP Client |
| Lucide React | 0.556.0 | Icons |
| React Hot Toast | 2.6.0 | Notifications |
| React PDF to Text | 1.3.4 | PDF Text Extraction |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 20+ | Runtime |
| Express | 5.2.1 | Web Framework |
| MongoDB | - | Database |
| Mongoose | 9.0.1 | ODM |
| TypeScript | - | Type Safety |
| JWT | 9.0.3 | Authentication |
| Bcrypt | 6.0.0 | Password Hashing |
| Multer | 2.0.2 | File Upload |
| Helmet | 8.2.0 | Security Headers |
| Morgan | 1.11.0 | HTTP Logging |
| Express Rate Limit | 8.5.2 | Rate Limiting |

### AI & Services
| Service | Purpose |
|---|---|
| Groq (LLaMA 3.3 70B) | AI Text Generation — Free |
| ImageKit | Image CDN + Background Removal |
| MongoDB Atlas | Cloud Database |
| Vercel | Deployment |
| Docker | Containerization |
| GitHub Actions | CI/CD Pipeline |

### Testing & Quality
| Tool | Purpose |
|---|---|
| Jest | Unit Testing Framework |
| Supertest | API Endpoint Testing |
| TypeScript | Static Type Checking |

---

## 📁 Project Structure

```
ai-resume-builder/
├── .github/
│   └── workflows/
│       ├── client-ci.yml        # Client CI/CD
│       └── server-ci.yml        # Server CI/CD
│
├── client/                      # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── store.js
│   │   │   └── features/
│   │   │       └── authSlice.js
│   │   ├── components/
│   │   │   ├── home/
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── Features.jsx
│   │   │   │   ├── Banner.jsx
│   │   │   │   ├── Testimonisl.jsx
│   │   │   │   ├── CallToAction.jsx
│   │   │   │   └── Footer.jsx
│   │   │   ├── templates/
│   │   │   │   ├── ClassicTemplate.jsx
│   │   │   │   ├── ModernTemplate.jsx
│   │   │   │   ├── MinimalTemplate.jsx
│   │   │   │   └── MinimalImageTemplate.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ResumePreview.jsx
│   │   │   ├── PersonalInfoForm.jsx
│   │   │   ├── ExperienceForm.jsx
│   │   │   ├── EducationForm.jsx
│   │   │   ├── SkillsForm.jsx
│   │   │   ├── ProjectForm.jsx
│   │   │   ├── ProfessionalSummaryForm.jsx
│   │   │   ├── TemplateSelector.jsx
│   │   │   └── ColorPicker.jsx
│   │   ├── configs/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ResumeBuilder.jsx
│   │   │   ├── Preview.jsx
│   │   │   ├── CoverLetter.jsx
│   │   │   ├── ATSScore.jsx
│   │   │   ├── TemplateGenerator.jsx
│   │   │   ├── InterviewPrep.jsx
│   │   │   ├── BulletSuggestions.jsx
│   │   │   ├── LinkedInImport.jsx
│   │   │   └── JobTracker.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── __tests__/
│   │   ├── setup.js
│   │   ├── auth.test.js         # 11 auth tests
│   │   └── resume.test.js       # 6 resume tests
│   ├── configs/
│   │   ├── ai.js / ai.ts        # Groq AI config
│   │   ├── db.js                # MongoDB config
│   │   ├── imagekit.js          # ImageKit config
│   │   └── multer.js            # File upload config
│   ├── controllers/
│   │   ├── UserControllers.js/.ts
│   │   ├── aiController.js/.ts
│   │   ├── resumeController.js
│   │   └── jobController.js/.ts
│   ├── middleware/
│   │   ├── authMiddleware.js/.ts
│   │   ├── errorMiddleware.js/.ts
│   │   └── rateLimitMiddleware.js
│   ├── models/
│   │   ├── User.js/.ts
│   │   ├── Resume.js/.ts
│   │   └── JobApplication.js/.ts
│   ├── routes/
│   │   ├── userRoutes.js/.ts
│   │   ├── resumeRoutes.js/.ts
│   │   ├── aiRoutes.js/.ts
│   │   └── jobRoutes.js/.ts
│   ├── types/
│   │   └── index.ts             # All TypeScript interfaces
│   ├── Dockerfile
│   ├── server.js
│   ├── tsconfig.json
│   ├── vercel.json
│   └── package.json
│
├── docker-compose.yml
├── .env
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v20+
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)
- ImageKit account (free tier)

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

Start server:
```bash
npm run server
```

Output:
```
✅ Server running on port 5000
✅ Environment: development
✅ MongoDB connected
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

Start client:
```bash
npm run dev
```

Open **http://localhost:5173** 🎉

---

## 🐳 Docker Setup

Run the entire app with one command:

```bash
# Start everything
docker-compose up --build

# Run in background
docker-compose up -d

# Stop
docker-compose down
```

Access:
- Frontend: `http://localhost:80`
- Backend: `http://localhost:5000`

---

## 🧪 Running Tests

```bash
cd server
npm test
```

Output:
```
PASS __tests__/auth.test.js
  ✅ Register with valid data
  ✅ Register fails - missing fields
  ✅ Register fails - short password
  ✅ Register fails - invalid email
  ✅ Register fails - duplicate email
  ✅ Login successfully
  ✅ Login fails - wrong password
  ✅ Login fails - wrong email
  ✅ Login fails - missing fields
  ✅ Protected route fails - no token
  ✅ Protected route works - valid token

PASS __tests__/resume.test.js
  ✅ Create resume successfully
  ✅ Create fails without auth
  ✅ Get resume by id
  ✅ Get fails with invalid id
  ✅ Delete resume successfully
  ✅ Delete fails without auth

Tests: 17 passed, 17 total ✅
```

---

## 🔑 Getting API Keys

### Groq API (Free)
1. Go to **[console.groq.com](https://console.groq.com)**
2. Sign up → API Keys → Create key
3. Key starts with `gsk_...`

### ImageKit (Free Tier)
1. Go to **[imagekit.io](https://imagekit.io)**
2. Sign up → Settings → API Keys → Copy Private Key

### MongoDB Atlas (Free M0)
1. Go to **[cloud.mongodb.com](https://cloud.mongodb.com)**
2. Create free M0 cluster
3. Network Access → Allow `0.0.0.0/0`
4. Get connection string from Connect → Drivers

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | No | Register new user |
| POST | `/api/users/login` | No | Login user |
| GET | `/api/users/data` | Yes | Get current user |
| GET | `/api/users/resumes` | Yes | Get user's resumes |

### Resumes
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/resumes/create` | Yes | Create new resume |
| PUT | `/api/resumes/update` | Yes | Update resume + image upload |
| DELETE | `/api/resumes/delete/:id` | Yes | Delete resume |
| GET | `/api/resumes/get/:id` | Yes | Get resume (protected) |
| GET | `/api/resumes/public/:id` | No | Get resume (public) |

### AI Features
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/ai/enhance-pro-sum` | Yes | Enhance professional summary |
| POST | `/api/ai/enhance-job-desc` | Yes | Enhance job description |
| POST | `/api/ai/upload-resume` | Yes | Parse PDF resume with AI |
| POST | `/api/ai/cover-letter` | Yes | Generate cover letter |
| POST | `/api/ai/analyze-ats` | Yes | ATS score analysis |
| POST | `/api/ai/generate-template` | Yes | Generate AI resume template |
| POST | `/api/ai/interview-questions` | Yes | Generate interview questions |
| POST | `/api/ai/suggest-bullets` | Yes | AI bullet point suggestions |
| POST | `/api/ai/import-linkedin` | Yes | Import LinkedIn PDF |

### Job Tracker
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs/all` | Yes | Get all job applications |
| POST | `/api/jobs/add` | Yes | Add new application |
| PUT | `/api/jobs/update` | Yes | Update application |
| DELETE | `/api/jobs/delete/:id` | Yes | Delete application |

---

## 🚀 Deployment

### Vercel (Recommended)

**Server:**
```bash
cd server
vercel --prod
```

**Client** (update `.env` first):
```env
VITE_BASE_URL=https://your-server.vercel.app
```
```bash
cd client
vercel --prod
```

Add all environment variables in Vercel Dashboard → Settings → Environment Variables.

---

## 🆚 Why Choose This Over Competitors?

| Feature | This App | Zety | Resume.io | Kickresume | Rezi |
|---|---|---|---|---|---|
| Price | ✅ Free | 💰 $3/mo | 💰 $6/mo | 💰 $4/mo | 💰 $3/mo |
| AI Templates | ✅ Unlimited | ❌ | ❌ | ❌ | ❌ |
| ATS Scorer | ✅ Free | 💰 Paid | ❌ | 💰 Paid | 💰 Paid |
| Interview Prep | ✅ Free | ❌ | ❌ | ❌ | ❌ |
| Bullet AI | ✅ Free | ❌ | ❌ | ❌ | ❌ |
| LinkedIn Import | ✅ Free | 💰 Paid | 💰 Paid | 💰 Paid | ❌ |
| Cover Letter | ✅ Free | 💰 Paid | 💰 Paid | 💰 Paid | ❌ |
| Job Tracker | ✅ Free | ❌ | ❌ | ❌ | ❌ |
| Open Source | ✅ Yes | ❌ | ❌ | ❌ | ❌ |
| Docker | ✅ Yes | ❌ | ❌ | ❌ | ❌ |
| Unit Tests | ✅ 17/17 | ❌ | ❌ | ❌ | ❌ |

---

## 🤝 Contributing

Contributions are welcome!

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
- Live App: [ai-resume-builder.vercel.app](https://ai-resume-builder.vercel.app)

---

## ⭐ Show Your Support

If this project helped you, please give it a **⭐ star** on GitHub!

---

*Built with ❤️ using MERN Stack + Groq AI + TypeScript + Docker*