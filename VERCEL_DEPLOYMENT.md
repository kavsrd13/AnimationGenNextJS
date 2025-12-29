# Vercel Deployment Guide

## Prerequisites

- GitHub account
- Vercel account (free at https://vercel.com)
- Your Azure OpenAI credentials

## Step-by-Step Deployment

### 1. Push to GitHub

If you haven't already:

```bash
cd d:\work\AnimationUI
git init
git add .
git commit -m "Initial commit - Manim Animation Generator"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"

### 3. Configure Environment Variables

In the Vercel deployment settings, add these environment variables:

| Name | Value |
|------|-------|
| `AZURE_OPENAI_API_KEY` | Your Azure OpenAI API key |
| `AZURE_OPENAI_ENDPOINT` | `https://demofoundry09821.openai.azure.com/` |
| `AZURE_OPENAI_DEPLOYMENT_NAME` | `gpt-4.1` |
| `ANIMATION_SERVER_URL` | `https://manim-mcp-app.salmonforest-f54e4566.eastus.azurecontainerapps.io` |

### 4. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for the build to complete
3. Your app will be live at `https://your-project.vercel.app`

## Automatic Deployments

Every time you push to `main` branch on GitHub, Vercel will automatically:
- Build your app
- Run tests
- Deploy to production

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables Management

To update environment variables after deployment:

1. Go to your project in Vercel dashboard
2. Click "Settings" → "Environment Variables"
3. Add/Edit variables
4. Click "Redeploy" to apply changes

## Production Build Locally

Test your production build before deploying:

```bash
npm run build
npm run start
```

Visit http://localhost:3000 to test the production build.

## Monitoring and Logs

- **Analytics**: Vercel dashboard shows page views and performance
- **Logs**: View real-time logs in Vercel dashboard
- **Errors**: Check the "Functions" tab for API route errors

## Performance Tips

1. **Edge Functions**: Vercel automatically optimizes API routes
2. **CDN**: Static assets served from global CDN
3. **Image Optimization**: Next.js optimizes images automatically
4. **Caching**: Configure caching headers if needed

## Troubleshooting Deployment

### Build Fails

Check the build logs in Vercel dashboard:
- Look for TypeScript errors
- Verify all dependencies are in `package.json`
- Ensure environment variables are set

### API Routes Fail

- Check environment variables are set correctly
- View function logs in Vercel dashboard
- Test API routes locally first

### Slow Performance

- Check animation server response times
- Monitor Azure OpenAI API latency
- Consider adding loading states

## Cost Considerations

- **Vercel**: Free tier includes 100 GB bandwidth/month
- **Azure OpenAI**: Pay per token usage
- **Animation Server**: Running on Azure Container Apps

## Security Best Practices

✅ **Already Implemented:**
- API keys stored in environment variables
- Server-side API calls (keys never exposed to browser)
- Input validation on API routes

🔒 **Additional Recommendations:**
- Enable rate limiting if needed
- Add authentication for production use
- Monitor API usage to prevent abuse

## Next Steps After Deployment

1. Test all functionality on production URL
2. Share your app with users
3. Monitor usage and errors
4. Collect feedback for improvements
5. Set up custom domain if desired

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Issues**: Create an issue in your GitHub repo

---

**Your app is ready for the world!** 🚀
