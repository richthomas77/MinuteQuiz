# Deploying to Vercel

## Quick Setup

### Option 1: Direct Upload
1. **Download your project** as a ZIP file from Replit
2. **Extract** the files locally
3. **Add this to package.json scripts section:**
   ```json
   "vercel-build": "vite build"
   ```
4. **Go to [vercel.com](https://vercel.com)** and sign up
5. **Drag and drop** your project folder to Vercel
6. **Deploy!** Your quiz platform will be live in minutes

### Option 2: GitHub Integration (Recommended)
1. **Push your code to GitHub:**
   - Create a new repository on GitHub
   - Push your Replit code to the repository
2. **Connect to Vercel:**
   - Go to vercel.com and sign in
   - Click "Import Project"
   - Select your GitHub repository
3. **Configure build settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## Important Notes

### Current Setup
- ✅ **Frontend**: React + Vite (perfect for Vercel)
- ✅ **Backend**: Express API routes (works with Vercel functions)
- ✅ **Data**: In-memory storage (suitable for demo/learning)
- ✅ **Assets**: Your book cover image included

### For Production Use
If you want persistent data storage, consider:
- **Vercel KV** - For simple key-value storage
- **PlanetScale** - For MySQL database
- **Supabase** - For PostgreSQL database
- **MongoDB Atlas** - For document database

### Environment Variables
None needed for current setup since you're using in-memory storage.

## After Deployment
- Your app will get a URL like: `your-project.vercel.app`
- Updates: Push to GitHub and Vercel auto-deploys
- Custom domain: Add your own domain in Vercel dashboard

## Cost
- **Free tier** includes:
  - Unlimited deployments
  - 100GB bandwidth/month
  - Custom domains
  - Perfect for learning platforms like yours

Your quiz platform with 15 Framing questions and 14 GPS questions will work perfectly on Vercel!