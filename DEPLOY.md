# How to Deploy to GitHub Pages

This document explains how the Calendar View project is deployed using GitHub Pages.

---

## 1. Install Git
If Git is not installed, download and install it from:
https://git-scm.com/downloads

Verify installation:
```bash
git --version

## 2. Prepare the Project
1. Open `vite.config.ts`.
2. Add the `base` property with your repository name.
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: 'calendar-view-pradeep',
   })
   ```

## 3. Create a Repository on GitHub (Website Steps)
1. Go to [GitHub.com](https://github.com) and sign in.
2. In the top-right corner, click the **+** (plus) icon next to your profile picture.
3. Select **New repository**.
4. In the "Repository name" box, type: `calendar-view-pradeep` (or any name you like).
5. (Optional) In the "Description" box, type: `React Calendar Component`.
6. Enable "Public" (so your deployed site is visible).
7. **Do NOT** check "Add a README file" or .gitignore (keep it empty).
8. Click the green **Create repository** button at the bottom.

## 4. Connect Your Code (Requires Git)
After clicking "Create", you will see a page with commands. But first, **you must have Git installed** locally.
1. Download Git from [git-scm.com](https://git-scm.com/downloads) and install it.
2. **Restart** your terminal (close and open a new one).
3. Then run these commands in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/codedByPradeep/calendar-view-pradeep.git
   git push -u origin main
   ```
   *(Copy the exact `git remote add...` line from the GitHub page you just created)*

## 5. Deploy
Once your code is on GitHub, deploy it by running:
```bash
npm run deploy
```
This will create a `gh-pages` branch and publish your app.

## 6. Access Your Site
Your app will be live at: `https://codedByPradeep.github.io/calendar-view-pradeep/`
