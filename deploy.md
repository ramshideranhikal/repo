# GitHub Pages Deployment Guide

## Step 1: Repository Setup

1. **Create a new GitHub repository** (or use existing one)
   - Repository name: `portfolio-animated-text` (or your preferred name)
   - Make sure it's public

2. **Update the Vite config** in `vite.config.ts`:
   ```typescript
   base: '/your-repository-name/', // Replace with your actual repository name
   ```

## Step 2: Local Setup

1. **Clone/upload your project** to the repository
2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Test locally**:
   ```bash
   npm run dev
   ```

## Step 3: Deploy to GitHub Pages

### Option A: Using GitHub Actions (Recommended)

1. **Create `.github/workflows/deploy.yml`**:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'

         - name: Install dependencies
           run: npm install

         - name: Build
           run: npm run build

         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy portfolio"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to repository Settings > Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Save

### Option B: Using npm deploy script

1. **Run deploy command**:
   ```bash
   npm run deploy
   ```

2. **Enable GitHub Pages** (same as Option A, step 3)

## Step 4: Configure Custom Domain (Optional)

If you have a custom domain:

1. **Add CNAME file** in `/public/CNAME`:
   ```
   yourdomain.com
   ```

2. **Configure DNS** to point to your GitHub Pages URL

## Step 5: Verify Deployment

Your portfolio will be available at:
- `https://yourusername.github.io/repository-name/`

## Troubleshooting

### Common Issues:

1. **404 Error**: Check that the `base` in `vite.config.ts` matches your repository name
2. **Assets not loading**: Ensure all imports use relative paths
3. **Build fails**: Check console for TypeScript errors

### GitHub Pages Settings:
- Source: Deploy from a branch
- Branch: gh-pages (created automatically)
- Folder: / (root)

## File Structure After Setup:
```
your-repository/
├── .github/workflows/deploy.yml (if using GitHub Actions)
├── dist/ (generated after build)
├── public/
│   ├── vite.svg
│   └── CNAME (if using custom domain)
├── components/
├── imports/
├── styles/
├── package.json
├── vite.config.ts
├── index.html
├── main.tsx
└── App.tsx
```

## Updates

To update your live site:
1. Make changes to your code
2. Push to main branch
3. GitHub Actions will automatically rebuild and deploy
4. Or run `npm run deploy` manually

---

Your portfolio is now live and ready to impress! 🚀