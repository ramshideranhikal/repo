# GitHub Pages Deployment Guide

## Problem
You have both React and HTML files in the same repository, which is causing conflicts with GitHub Pages. The animation works in Figma preview but not on your live site.

## Solution
Use the clean HTML/CSS/JS files in the `/docs` folder for GitHub Pages deployment.

## Step-by-Step Instructions

### Option 1: Deploy from /docs folder (Recommended)

1. **Push your code to GitHub**
2. **Go to your repository on GitHub**
3. **Click on "Settings" tab**
4. **Scroll down to "Pages" section**
5. **Under "Source", select "Deploy from a branch"**
6. **Choose your main branch (usually `main` or `master`)**
7. **Set folder to `/docs`**
8. **Click "Save"**

Your site will be available at: `https://yourusername.github.io/repository-name/`

### Option 2: Use root directory (Alternative)

If you want to deploy from the root directory:

1. **Delete or move these React files to a subfolder:**
   - `App.tsx`
   - `main.tsx`
   - `vite.config.ts`
   - `package.json`
   - `components/` folder
   - `tailwind.config.js`
   - `postcss.config.js`

2. **Keep only these files in root:**
   - `index.html`
   - `styles.css`
   - `script.js`
   - `.nojekyll` (already created)

3. **Set GitHub Pages source to root directory**

## Files Structure for GitHub Pages

### Required Files:
- `index.html` - Main HTML file
- `styles.css` - All CSS styles
- `script.js` - Animation JavaScript
- `.nojekyll` - Tells GitHub Pages to skip Jekyll processing

### Features Included:
- ✅ Mobile-first responsive design
- ✅ Guaranteed 3 highlight words display
- ✅ Three animation modes (Blink, Wave, Wind)
- ✅ Professional portfolio layout
- ✅ Console logging for debugging

## Troubleshooting

### Animation Not Working?
1. **Check browser console** (F12 → Console tab)
2. **Look for error messages**
3. **Verify these console logs appear:**
   - "DOM loaded, initializing portfolio animation..."
   - "Portfolio animation initialized successfully"
   - "Grid dimensions: X x Y Canvas: W x H"

### Mobile Issues?
1. **Check mobile-specific logs:**
   - "Using mobile-specific word placement algorithm"
   - "Mobile words selected: [...] for X columns"
   - "Mobile placed word 'WORD' at row X, col Y"

### Still Not Working?
1. **Wait 5-10 minutes** after deployment
2. **Clear browser cache** (Ctrl+F5 or Cmd+Shift+R)
3. **Try incognito/private browsing mode**
4. **Check GitHub Pages deployment status** in repository settings

## Final URL Structure

After deployment, your site will be accessible at:
- Main site: `https://yourusername.github.io/repository-name/`
- Mobile test: `https://yourusername.github.io/repository-name/mobile-test.html`

## Need Help?

If you're still having issues:
1. Check the browser console for error messages
2. Verify the GitHub Pages deployment status
3. Ensure all files are in the correct location
4. Try the mobile test page to isolate issues