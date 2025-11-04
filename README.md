# 🚀 BAT-VC Agentic Studio

**Execution-as-a-Service meets Venture Capital Platform**

A comprehensive platform that combines AI automation with human expertise to help founders build startups in 8-12 weeks, and enables VCs to manage and analyze their portfolios with AI-powered insights.

## ✨ Features

### For Founders:
- **8-Step Startup Journey**: From onboarding to product-market fit
- **AI-Powered Guidance**: Intelligent agents at each step
  - Idea Validation
  - AI Suite Configuration
  - MVP Development Planning
  - Go-to-Market Strategy
  - Metrics Analysis
- **Real-time AI Assistance**: Chat with AI advisors throughout your journey
- **Progress Tracking**: Visual journey progress with step completion

### For VCs:
- **Portfolio Dashboard**: Manage and track portfolio companies
- **Investment Pipeline**: Track companies through stages (Applicants → Under Review → Due Diligence → Invested)
- **AI Analytics**: Automated insights and health scores for portfolio companies
- **Metrics Tracking**: Comprehensive analytics and reporting

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+), Chart.js
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: JWT-based
- **AI Integration**: OpenAI API (with mock AI fallback for development)

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd bat-vc-agentic-studio
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your configuration
# Replace YOUR_PASSWORD with your PostgreSQL password
```

### 4. Configure Database
Update `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/batvc
```

### 5. Start the Server
```bash
npm start
```

The server will start on `http://localhost:3000`

### 6. Open the Frontend
Open `client/index.html` in your browser, or serve it using a local server.

## 📁 Project Structure

```
bat-vc-agentic-studio/
├── client/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling
│   └── app.js             # Frontend JavaScript
├── server/                 # Backend files
│   ├── index.js           # Server entry point
│   ├── database/          # Database configuration
│   │   └── init.js        # Database initialization
│   ├── middleware/        # Middleware
│   │   └── auth.js        # JWT authentication
│   ├── routes/            # API routes
│   │   ├── auth.js       # Authentication routes
│   │   ├── founder.js    # Founder journey routes
│   │   ├── vc.js         # VC dashboard routes
│   │   └── ai.js         # AI agent routes
│   ├── agents/           # AI agents
│   │   ├── ideaValidation.js
│   │   ├── aiSuite.js
│   │   ├── mvpGuidance.js
│   │   ├── gtmStrategy.js
│   │   ├── metricsAnalysis.js
│   │   └── portfolioAnalysis.js
│   └── utils/            # Utilities
│       └── mockAI.js     # Mock AI responses
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment file
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies
└── README.md             # This file
```

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/batvc
JWT_SECRET=your-secret-key-change-in-production
OPENAI_API_KEY=  # Optional - leave empty to use mock AI
```

## 🤖 AI Features

The platform includes intelligent AI agents that provide:

- **Idea Validation**: Market analysis, competitor research, feasibility scoring
- **Tool Recommendations**: AI-powered tool suggestions for your startup
- **MVP Guidance**: Feature prioritization and technical recommendations
- **GTM Strategy**: Go-to-market planning and channel recommendations
- **Metrics Analysis**: Health assessment and PMF scoring
- **Portfolio Analysis**: VC portfolio company insights

**Note**: The application works completely without an OpenAI API key using mock AI responses. Add your API key in `.env` to enable real AI features.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Founder Journey
- `GET /api/founder/journey` - Get founder journey
- `GET /api/founder/journey/step/:stepNumber` - Get step data
- `PUT /api/founder/journey/step/:stepNumber` - Update step data

### VC Dashboard
- `GET /api/vc/portfolio` - Get portfolio
- `GET /api/vc/pipeline` - Get pipeline
- `GET /api/vc/analytics` - Get analytics

### AI Agents
- `POST /api/ai/validate-idea` - Validate startup idea
- `POST /api/ai/recommend-tools` - Get tool recommendations
- `POST /api/ai/generate-gtm` - Generate GTM strategy
- `POST /api/ai/analyze-metrics` - Analyze metrics
- `POST /api/ai/chat` - Generic AI chat

## 🧪 Development

### Run in Development Mode
```bash
npm run dev
```

This uses `nodemon` for auto-restart on file changes.

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Built with ❤️ for founders and VCs**

