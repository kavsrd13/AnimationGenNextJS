# Manim Animation Generator

A modern web application for generating mathematical animations using AI and Manim. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful gradient UI with Tailwind CSS
- 🤖 AI-powered prompt enhancement using Azure OpenAI
- 🎬 Automatic Manim code generation
- 📹 Server-side animation rendering
- ⬇️ Video download functionality
- 📊 Real-time progress tracking
- 🎯 Example prompts for quick start

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Azure OpenAI GPT-4
- **Animation**: Manim (via Azure Container Apps)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Azure OpenAI API access
- Manim animation server endpoint

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd AnimationUI
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:
```env
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-endpoint.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4.1
ANIMATION_SERVER_URL=https://your-manim-server.azurecontainerapps.io
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a description of the animation you want to create
2. Click "Generate Animation"
3. Wait for the 3-step process:
   - Prompt Enhancement (AI improves your description)
   - Code Generation (AI creates Manim code)
   - Video Rendering (Server renders the animation)
4. View and download your animation!

## Example Prompts

- "Visualize the Pythagorean theorem with a right triangle"
- "Show how a circle transforms into a square"
- "Demonstrate the concept of derivatives"
- "Animate a sorting algorithm with colored bars"

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

## Project Structure

```
AnimationUI/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── enhance-prompt/route.ts
│   │   │   └── generate-animation/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── PromptInput.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── AnimationPreview.tsx
│   │   └── ErrorDisplay.tsx
│   └── types/
│       └── index.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── .env.local
```

## API Routes

### POST /api/enhance-prompt
Enhances user prompt using Azure OpenAI.

**Request:**
```json
{
  "prompt": "Create a blue circle"
}
```

**Response:**
```json
{
  "enhancedPrompt": "Create an animation showing a blue circle..."
}
```

### POST /api/generate-animation
Generates code and renders animation.

**Request:**
```json
{
  "enhancedPrompt": "Detailed animation description..."
}
```

**Response:**
```json
{
  "code": "circle = Circle()...",
  "videoBase64": "base64_encoded_video",
  "renderTime": 8.5,
  "videoSize": 45678
}
```

## Troubleshooting

- **Animation fails**: Try simplifying your prompt
- **Long render times**: Complex animations take longer (30s-2min)
- **API errors**: Verify Azure OpenAI credentials
- **Server errors**: Check animation server is running

## License

MIT

## Acknowledgments

- [Manim Community](https://www.manim.community/) for the animation engine
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-services/openai-service) for AI capabilities
- [Next.js](https://nextjs.org/) for the React framework
