# ⚡ Quick Start Guide (5 Minutes)

If you're in a hurry, here's the fastest way to get your portfolio live:

## 1. Create GitHub Repository

- Go to [github.com](https://github.com) → Sign up/Login
- Click "New" repository
- Name: `portfolio`
- Make it **Public** ✅
- Add README ✅
- Create repository

## 2. Upload Your Files

- In your repository, click "uploading an existing file"
- Drag ALL your project files (maintain folder structure)
- Commit message: "Initial upload"
- Click "Commit changes"

## 3. Edit vite.config.ts

- Click on `vite.config.ts` in your repo
- Click pencil icon to edit
- Change line 6 to: `base: '/portfolio/',` (or your repo name)
- Commit changes

## 4. Create GitHub Actions File

- Click "Add file" → "Create new file"
- Name: `.github/workflows/deploy.yml`
- Copy the deployment code from `BEGINNER_DEPLOYMENT_GUIDE.md`
- Commit the file

## 5. Enable GitHub Pages

- Go to Settings → Pages
- Source: "GitHub Actions"
- Save

## 6. Your Portfolio is Live! 🎉

**URL:** `https://your-username.github.io/portfolio/`

Wait 5-10 minutes for first deployment. Check Actions tab for progress.

---

**Need detailed help?** See `BEGINNER_DEPLOYMENT_GUIDE.md` for step-by-step instructions!