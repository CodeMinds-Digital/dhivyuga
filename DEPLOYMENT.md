# 🚀 Dhivyuga Netlify Deployment Guide

## 📋 Prerequisites

1. **Netlify Account** - Sign up at [netlify.com](https://netlify.com)
2. **GitHub Repository** - Your code should be in a GitHub repository
3. **Supabase Project** - Set up your Supabase project and get credentials

## 🔧 Deployment Steps

### 1. **Connect Repository to Netlify**
- Go to Netlify Dashboard
- Click "New site from Git"
- Connect your GitHub account
- Select your Dhivyuga repository

### 2. **Configure Build Settings**
- **Build command**: `npm ci --legacy-peer-deps && npm run build`
- **Publish directory**: `.next`
- **Node version**: `18`

### 3. **Environment Variables**
Add these environment variables in Netlify:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_VERSION=18
NPM_FLAGS=--legacy-peer-deps
```

### 4. **Deploy**
- Click "Deploy site"
- Wait for the build to complete
- Your site will be available at the generated Netlify URL

## 🛠️ Troubleshooting

### If you get dependency conflicts:
1. Check that `.npmrc` file is in your repository
2. Ensure `netlify.toml` is configured correctly
3. Verify Node version is set to 18

### If build fails:
1. Check build logs in Netlify dashboard
2. Ensure all environment variables are set
3. Try clearing build cache in Netlify

## 📁 Important Files

- `.npmrc` - NPM configuration for peer dependencies
- `netlify.toml` - Netlify build configuration
- `package.json` - Updated with React 18 and compatible versions

## 🔐 Security Notes

- Never commit `.env.local` to your repository
- Use Netlify environment variables for sensitive data
- Ensure Supabase RLS policies are properly configured

## ✅ Post-Deployment

1. Test all functionality on the deployed site
2. Set up custom domain if needed
3. Configure Supabase auth redirects for your domain
4. Test admin authentication with your Supabase credentials

## 🆘 Support

If you encounter issues:
1. Check Netlify build logs
2. Verify all environment variables
3. Ensure Supabase configuration is correct
4. Test locally with `npm run build` first
