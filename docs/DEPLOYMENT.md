# Deployment Instructions

## Deploy to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project root:**
   ```bash
   cd /home/admin-cse/Desktop/SIH_avanti/SIH_2025
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? **Your account**
   - Link to existing project? **N**
   - Project name? **farm-management-portal**
   - Directory? **./project**

## Alternative: GitHub + Vercel

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Deploy automatically

## Live URL
After deployment, you'll get a URL like:
`https://farm-management-portal-xxx.vercel.app`

## Features Available:
- ✅ Mobile-based registration/login
- ✅ Farm dashboard with statistics
- ✅ Interactive biosecurity checklist
- ✅ Real-time compliance scoring
- ✅ Alert notifications
- ✅ Mobile-responsive design
