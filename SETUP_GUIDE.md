# Quick Setup Guide

## ✅ Project Setup Complete!

Your Next.js Manim Animation Generator is ready to use!

## 🚀 What's Been Created

- ✅ Next.js 14 application with TypeScript
- ✅ React 18 components (PromptInput, ProgressIndicator, AnimationPreview, ErrorDisplay)
- ✅ API routes for Azure OpenAI integration
- ✅ Tailwind CSS styling with gradient theme
- ✅ All dependencies installed
- ✅ Development server running at http://localhost:3000

## ⚙️ Important: Configure Your Credentials

**BEFORE TESTING**, you need to add your Azure OpenAI credentials:

1. Open the file: `.env.local`
2. Replace `your_azure_openai_api_key_here` with your actual API key
3. Save the file
4. The server will auto-reload

### Current .env.local values:
```env
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here  # ← UPDATE THIS!
AZURE_OPENAI_ENDPOINT=https://demofoundry09821.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1
ANIMATION_SERVER_URL=https://manim-mcp-app.salmonforest-f54e4566.eastus.azurecontainerapps.io
```

## 🧪 Testing the Application

1. Make sure `.env.local` has your real API key
2. Open http://localhost:3000 in your browser
3. Try one of the example prompts:
   - "Visualize the Pythagorean theorem with a right triangle"
   - "Show how a circle transforms into a square"
4. Click "Generate Animation"
5. Watch the 3-step progress indicator
6. View and download your animation!

## 📁 Project Structure

```
AnimationUI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── enhance-prompt/route.ts    # Step 1: Enhance prompt
│   │   │   └── generate-animation/route.ts # Step 2&3: Generate + Render
│   │   ├── layout.tsx                      # Root layout
│   │   ├── page.tsx                        # Main page with state management
│   │   └── globals.css                     # Tailwind styles
│   ├── components/
│   │   ├── PromptInput.tsx                 # Input form with examples
│   │   ├── ProgressIndicator.tsx           # 3-step progress display
│   │   ├── AnimationPreview.tsx            # Video player + download
│   │   └── ErrorDisplay.tsx                # Error messages
│   └── types/
│       └── index.ts                        # TypeScript interfaces
├── .env.local                              # Environment variables ⚠️
├── .env.example                            # Template
├── package.json                            # Dependencies
├── tsconfig.json                           # TypeScript config
├── tailwind.config.ts                      # Tailwind config
└── next.config.js                          # Next.js config
```

## 🎨 UI Features

- **Gradient Background**: Purple gradient (#667eea to #764ba2)
- **Responsive Design**: Works on desktop and mobile
- **Real-time Progress**: See each step as it happens
- **Code Preview**: View generated Manim code (collapsible)
- **Error Handling**: Detailed error messages with troubleshooting tips
- **Video Download**: One-click download of generated animations

## 🔧 Development Commands

```bash
npm run dev      # Start development server (already running!)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🌐 Deploy to Vercel

When you're ready to deploy:

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `AZURE_OPENAI_API_KEY`
   - `AZURE_OPENAI_ENDPOINT`
   - `AZURE_OPENAI_DEPLOYMENT_NAME`
   - `ANIMATION_SERVER_URL`
5. Click "Deploy"
6. Your app will be live at `your-project.vercel.app`!

## 🐛 Troubleshooting

### "Failed to enhance prompt"
- Check that `AZURE_OPENAI_API_KEY` is correct in `.env.local`
- Verify the endpoint URL is correct
- Check deployment name matches your Azure OpenAI deployment

### "Failed to render animation"
- Animation server might be temporarily down
- Try a simpler prompt
- Check the console for detailed error logs

### TypeScript errors
- Run `npm install` to ensure all dependencies are installed
- Restart VS Code if type definitions aren't loading

### Port 3000 already in use
- Stop other Next.js apps
- Or use a different port: `npm run dev -- -p 3001`

## 📖 API Flow

```
User enters prompt
    ↓
POST /api/enhance-prompt
    → Azure OpenAI enhances the prompt
    ↓
POST /api/generate-animation
    → Azure OpenAI generates Manim code
    → Animation server renders video
    ↓
Video displayed in browser
```

## 🎯 Next Steps

1. **Update `.env.local`** with your real API key
2. **Test the application** with example prompts
3. **Customize the UI** (colors, fonts, etc.)
4. **Deploy to Vercel** for production use
5. **Share your animations!**

## 💡 Tips for Best Results

- Keep prompts clear and educational
- Use mathematical notation freely - LaTeX is fully supported with MathTex() and Tex()
- Focus on teaching concepts to students step-by-step
- Use visual aids like arrows, colors, and annotations to enhance learning
- Be patient - rendering can take 10-60 seconds
- Try the example prompts to see what works well

## 📝 Notes

- The original Streamlit app is still available at `d:\work\MCPproject\`
- This Next.js version uses the same Azure services
- Video files are temporarily stored in browser memory
- All processing happens server-side for security

---

**Ready to create animations?** Update your `.env.local` and start generating! 🎉
