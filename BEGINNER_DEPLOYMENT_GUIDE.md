# 🚀 Complete Beginner's Guide to Deploy Your Portfolio

## What You'll Need
- A computer with internet connection
- Your project files (which you already have!)
- About 30 minutes

---

## Step 1: Create GitHub Account & Repository

### 1.1 Create GitHub Account
1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Choose a username (this will be part of your website URL)
4. Create your account

### 1.2 Create New Repository
1. Once logged in, click the green "New" button (or the "+" icon)
2. Repository name: `portfolio` (or any name you like)
3. Make sure it's **Public**
4. ✅ Check "Add a README file"
5. Click "Create repository"

---

## Step 2: Download Your Project Files

Since your files are in Figma Make, you need to download them:

### Option A: Manual Copy (Recommended for beginners)
1. Create a new folder on your desktop called `my-portfolio`
2. Copy each file content from Figma Make and save them in the correct structure:

```
my-portfolio/
├── App.tsx
├── README.md
├── package.json
├── index.html
├── main.tsx
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── eslint.config.js
├── components/
│   ├── PortfolioFigma.tsx
│   └── [all other component files]
├── imports/
│   └── [all import files]
├── styles/
│   └── globals.css
└── public/
    └── vite.svg
```

---

## Step 3: Install Required Software

### 3.1 Install Node.js
1. Go to [nodejs.org](https://nodejs.org)
2. Download the LTS version (recommended)
3. Install it (just click Next, Next, Next...)
4. Restart your computer

### 3.2 Install Git
1. Go to [git-scm.com](https://git-scm.com)
2. Download Git for your operating system
3. Install it (default settings are fine)

---

## Step 4: Upload Files to GitHub

### 4.1 Using GitHub Web Interface (Easiest Method)

1. **Go to your repository** on GitHub
2. **Delete the default README.md** (click on it, then click the trash icon)
3. **Upload your files:**
   - Click "uploading an existing file"
   - Drag and drop ALL your project files
   - Make sure to maintain the folder structure
   - Write commit message: "Initial portfolio upload"
   - Click "Commit changes"

### 4.2 Important: Update Repository Name
1. **Edit `vite.config.ts`** in GitHub:
   - Click on the file in your repository
   - Click the pencil icon to edit
   - Change line 6 from:
     ```typescript
     base: '/portfolio-animated-text/',
     ```
     to:
     ```typescript
     base: '/portfolio/', // Use your actual repository name
     ```
   - Click "Commit changes"

---

## Step 5: Enable GitHub Pages

1. **Go to your repository settings:**
   - Click "Settings" tab (near the top)
   - Scroll down to "Pages" in the left sidebar

2. **Configure Pages:**
   - Source: "Deploy from a branch"
   - Branch: "main" 
   - Folder: "/ (root)"
   - Click "Save"

3. **Wait for deployment:**
   - GitHub will show a message like "Your site is ready to be published"
   - It might take 5-10 minutes

---

## Step 6: Set Up GitHub Actions (Automated Deployment)

1. **Create a new file** in your repository:
   - Click "Add file" > "Create new file"
   - Name it: `.github/workflows/deploy.yml`
   - Copy and paste this content:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. **Commit the file**

---

## Step 7: Update GitHub Pages Settings (Final Step)

1. **Go back to Settings > Pages**
2. **Change Source to:**
   - Source: "GitHub Actions"
3. **Save**

---

## Step 8: See Your Live Portfolio! 🎉

1. **Your website will be live at:**
   ```
   https://your-username.github.io/portfolio/
   ```

2. **Check the Actions tab** to see deployment progress:
   - Green checkmark = successful deployment
   - Red X = something went wrong (don't worry, we can fix it!)

---

## 🆘 Troubleshooting

### Website shows 404 error?
- Check that `vite.config.ts` base matches your repository name
- Make sure GitHub Pages is enabled with "GitHub Actions" source

### Files not uploading?
- Try uploading folders one at a time
- Make sure you maintain the folder structure

### Build failing?
- Check the Actions tab for error messages
- Common fix: make sure all file names match exactly

### Need help?
- Check the Actions tab for detailed error logs
- GitHub community forums are very helpful for beginners

---

## 🎯 Quick Checklist

- [ ] GitHub account created
- [ ] Repository created and set to public
- [ ] All project files uploaded to GitHub
- [ ] `vite.config.ts` updated with correct repository name
- [ ] GitHub Actions workflow file created
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] Website is live and working

---

## 🎉 Congratulations!

Your animated text portfolio is now live on the internet! Anyone can visit your URL and see your amazing work.

### Next Steps:
- Share your portfolio URL with friends and on social media
- Update your LinkedIn/resume with the portfolio link
- Make changes by editing files in GitHub - they'll automatically deploy!

**Your live portfolio:** `https://your-username.github.io/portfolio/`

Welcome to the world of web development! 🚀