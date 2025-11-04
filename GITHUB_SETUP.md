# 🚀 GitHub Repository Setup Guide

This guide will walk you through setting up your GitHub repository and deploying your BAT-VC Agentic Studio application.

## 📋 Step 1: Create GitHub Repository

### Option A: Create via GitHub Website

1. **Go to GitHub**: Visit [github.com](https://github.com) and sign in
2. **Create New Repository**:
   - Click the **"+"** icon in the top right
   - Select **"New repository"**
   - Repository name: `bat-vc-agentic-studio`
   - Description: `Execution-as-a-Service meets Venture Capital Platform`
   - Choose **Public** or **Private** (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
   - Click **"Create repository"**

### Option B: Create via GitHub CLI (if installed)

```bash
gh repo create bat-vc-agentic-studio --public --description "Execution-as-a-Service meets Venture Capital Platform"
```

## 📋 Step 2: Initialize Git in Your Project

Open Command Prompt or PowerShell in your project folder:

```bash
cd C:\Users\Ria\bat-vc-agentic-studio

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: BAT-VC Agentic Studio platform"
```

## 📋 Step 3: Connect to GitHub Repository

### If you created the repository via website:

```bash
# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bat-vc-agentic-studio.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If you created via CLI:

```bash
git branch -M main
git push -u origin main
```

## 📋 Step 4: Verify Upload

1. Go to your GitHub repository page
2. Verify all files are there:
   - ✅ `package.json`
   - ✅ `README.md`
   - ✅ `.gitignore`
   - ✅ `.env.example`
   - ✅ `client/` folder with all HTML, CSS, JS files
   - ✅ `server/` folder with all backend files

## 🔒 Important: Environment Variables

**NEVER commit `.env` file to GitHub!**

The `.gitignore` file already excludes `.env`. Always use `.env.example` as a template.

## 📋 Step 5: Add Repository Description (Optional)

On your GitHub repository page:
1. Click the **gear icon** (⚙️) next to "About"
2. Add description: `Execution-as-a-Service meets Venture Capital Platform`
3. Add topics: `vc`, `startup`, `ai`, `venture-capital`, `nodejs`, `express`

## 📋 Step 6: Set Up Branch Protection (Optional but Recommended)

For production projects:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks
   - Include administrators

## 📋 Step 7: Create Additional Branches (Optional)

```bash
# Create development branch
git checkout -b development

# Create feature branch
git checkout -b feature/new-feature

# Push branches to GitHub
git push -u origin development
git push -u origin feature/new-feature
```

## 🔄 Making Future Changes

When you make changes to your code:

```bash
# Check what files changed
git status

# Add changed files
git add .

# Commit changes
git commit -m "Description of what you changed"

# Push to GitHub
git push
```

## 📋 Step 8: Hosting Options

### Backend Hosting (Render.com - Recommended)

1. **Go to Render.com**: Visit [render.com](https://render.com)
2. **Sign up/Login**: Create free account
3. **Create New Web Service**:
   - Connect your GitHub repository
   - Name: `bat-vc-agentic-studio-api`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add Environment Variables:
     - `PORT`: `3000`
     - `NODE_ENV`: `production`
     - `DATABASE_URL`: (from Render PostgreSQL)
     - `JWT_SECRET`: (generate a strong secret)
     - `OPENAI_API_KEY`: (optional)

4. **Create PostgreSQL Database**:
   - New → PostgreSQL
   - Name: `batvc-database`
   - Copy the `DATABASE_URL` and add it to your web service environment variables

### Frontend Hosting (Multiple Options)

#### Option 1: Vercel (Recommended for Frontend)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: `Other`
   - Root Directory: `client`
   - Build Command: (leave empty for static files)
   - Output Directory: `client`

#### Option 2: GitHub Pages (Free)
1. Go to your repository **Settings**
2. Scroll to **Pages**
3. Source: `Deploy from a branch`
4. Branch: `main` / `client` folder
5. Save

#### Option 3: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Import from Git
3. Connect GitHub repository
4. Build settings:
   - Base directory: `client`
   - Publish directory: `client`

## 🔐 Security Checklist

Before making your repository public:

- [ ] `.env` file is NOT in repository (check `.gitignore`)
- [ ] `.env.example` exists with placeholder values
- [ ] No API keys or secrets in code
- [ ] Database passwords are not committed
- [ ] JWT_SECRET is different in production

## 📝 Repository Best Practices

1. **Write Good Commit Messages**:
   ```
   feat: Add user authentication
   fix: Resolve database connection issue
   docs: Update README with setup instructions
   ```

2. **Use Issues**: Track bugs and feature requests
3. **Use Pull Requests**: Review code before merging
4. **Add License**: MIT License is already in package.json

## 🎉 You're Done!

Your repository is now set up and ready for collaboration and deployment!

### Quick Commands Reference:

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/bat-vc-agentic-studio.git

# Pull latest changes
git pull

# Check status
git status

# View commit history
git log

# Create and switch to new branch
git checkout -b branch-name

# Switch branches
git checkout main
```

---

**Need Help?** Check GitHub's documentation: [docs.github.com](https://docs.github.com)

