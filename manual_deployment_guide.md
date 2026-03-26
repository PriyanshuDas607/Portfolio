# Manual Deployment Guide

This guide explains how to manually build and deploy your Portfolio project to any static hosting service (like Vercel, Netlify, or GitHub Pages).

## 1. Prepare Environment Variables
Before building, ensure your `.env.local` file contains the correct production keys:
- `VITE_GEMINI_API_KEY` (Get from Google AI Studio)
- `VITE_EMAILJS_SERVICE_ID` (Get from EmailJS Dashboard)
- `VITE_EMAILJS_TEMPLATE_ID` (Get from EmailJS Dashboard)
- `VITE_EMAILJS_PUBLIC_KEY` (Get from EmailJS Account Settings)

> [!IMPORTANT]
> Since this is a static site (Vite), environment variables prefixed with `VITE_` are "baked in" during the build process. If you change them, you **must** rebuild the project.

> [!WARNING]
> Your `VITE_GEMINI_API_KEY` will be bundled into your JavaScript and visible to anyone who visits your site. For a portfolio project, this is often acceptable, but be aware of your API usage limits.

## 2. Build for Production
Open your terminal in the project root and run:

```bash
npm run build
```

This command generates a `dist/` folder containing the optimized production assets.

## 3. Deploy the `dist` Folder
You can now upload the contents of the `dist/` folder to your provider:

### Option A: Netlify (Drag & Drop)
1. Ensure your `.env.local` is correct.
2. Run `npm run build`.
3. Go to [Netlify Drop](https://app.netlify.com/drop).
4. Drag and drop the `dist/` folder into the upload area.
5. Your site will be live instantly!

### Option B: Netlify (Git Integration)
If you connected your GitHub repository to Netlify:
1. Go to your Site Dashboard on Netlify.
2. Go to **Site configuration** > **Environment variables**.
3. Add the following variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
4. Trigger a new deploy (Go to **Deploys** > **Trigger deploy**).

### Option B: Vercel (CLI)
1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in your project root.
3. When prompted for the directory to deploy, specify `./dist`.

### Option C: GitHub Pages
1. Use the `gh-pages` package: `npm install -g gh-pages`
2. Run: `npx gh-pages -d dist`
3. Make sure to set `base: '/repo-name/'` in `vite.config.ts` if your GitHub URL is `username.github.io/repo-name$.

## 4. Verification
Once uploaded, visit your URL and check:
- Is the "Prompt Playground" working? (Requires Gemini API key).
- Are the contact forms working? (Requires EmailJS).

## 5. Post-Deployment: Changing the URL (Netlify)
If you used Netlify, you can change your site's URL from the default random one:

1.  **Log in to Netlify** and select your site.
2.  Go to **Site configuration** (or **Site settings**).
3.  Under **General** > **Site details**, click **Change site name**.
4.  Enter your preferred name (e.g., `priyanshu-portfolio.netlify.app`).

### Custom Domains
If you have your own domain (like `yourname.com`):
1.  Go to **Domain Management** in your site settings.
2.  Click **Add custom domain** and follow the instructions to update your DNS records.
