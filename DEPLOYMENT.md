# Hosting Guide: Brand New Day - Spider-Man Help Portal

This website is production-ready, compiled, and configured for instant public deployment on **Vercel**, **Netlify**, or **GitHub Pages**.

---

### Option 1: Deploy with Vercel CLI (Fastest - 30 seconds)
Run the following in your terminal from the project directory:
```bash
npx vercel
```
- Select your default scope and accept project settings.
- When asked for build settings, Vercel automatically detects `dist` and `npm run build`.
- You will immediately receive a live public URL (e.g. `https://brand-new-day-spidey.vercel.app`).

To deploy directly to production:
```bash
npx vercel --prod
```

---

### Option 2: Deploy via Netlify Drag & Drop / CLI
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Go to [Netlify Drop](https://app.netlify.com/drop) and drag-and-drop the generated `dist` folder.
   OR run via Netlify CLI:
   ```bash
   npx netlify deploy --prod --dir=dist
   ```

---

### Option 3: GitHub Repository Deployment
1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Brand New Day Spider-Man superhero help portal"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Connect your repository on [Vercel](https://vercel.com) or [Netlify](https://netlify.com). Every commit will automatically build and deploy!

---

### Verifying Automated Email Notifications in Production
1. Open your live public URL.
2. Enter your details into the Spider-Man Chatbot.
3. Submit a grievance — the automatic email alert `Subject: 🦸 Someone Needs Your Help!` will trigger instantly.
4. Click **Dispatches** in the navbar to review real-time incident receipts and export JSON logs.
