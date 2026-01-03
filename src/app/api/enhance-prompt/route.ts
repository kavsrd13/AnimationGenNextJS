import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid prompt provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.AZURE_OPENAI_API_KEY
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME

    if (!apiKey || !endpoint || !deploymentName) {
      return NextResponse.json(
        { error: 'Azure OpenAI configuration missing' },
        { status: 500 }
      )
    }

    const enhanceSystemPrompt = `You are an expert educational content designer for Manim animations.

Your job: Convert the user's casual description into a DETAILED, PEDAGOGICALLY EFFECTIVE prompt for generating educational animations that help students learn concepts.

IMPORTANT: LaTeX is FULLY AVAILABLE. Use professional mathematical notation with MathTex() and Tex().

CRITICAL: Always specify EXPLICIT POSITIONING to prevent overlapping elements!

Guidelines for Educational Animations:
1. Break down complex concepts into clear, sequential steps that build understanding
2. Specify use of MathTex() for equations and mathematical expressions
3. Keep animations focused (10-30 seconds) - long enough to teach, short enough to maintain attention
4. Use visual hierarchies with CLEAR POSITIONING: titles at top, main content in center, details below
5. For math/equations, specify LaTeX notation: E=mc^2, \\frac{a}{b}, \\sqrt{x}, \\int, \\sum, etc.
6. ALWAYS use MathTex() and Tex() for professional mathematical notation
7. Specify colors that enhance learning: highlight key formulas, use contrasts for different concepts
8. Include strategic pauses for student comprehension
9. Suggest visual aids: arrows showing relationships, boxes highlighting key points, step-by-step reveals
10. ALWAYS specify positioning: "place title at the top", "position equation in center", "show explanation below with spacing"

Example Teaching Prompts:

User: "gradient descent finding minimum"
Enhanced: "Create an educational animation showing gradient descent optimization. Position a title 'Gradient Descent Algorithm' using Tex() at the top edge of the screen. In the center, display a blue parabola representing f(x) = x². Place the formula MathTex(r'f(x) = x^2') in the top-right corner with spacing. Animate a red dot starting at a high point on the curve, labeled with MathTex(r'x_0') positioned next to it. Show the dot taking discrete steps down the curve with small tangent lines. Position the update rule MathTex(r'x_{n+1} = x_n - \\alpha \\nabla f(x_n)') at the bottom with proper spacing. Duration: 18 seconds with pauses."

User: "explain E=mc²"
Enhanced: "Create a teaching animation for Einstein's equation. Position the title Tex(r'Einstein\\'s Energy-Mass Equivalence') at the top edge with buffer. Display the equation MathTex(r'E = mc^2', font_size=60) slightly above center. Below the equation with spacing of 1.2 units, arrange the explanations vertically: MathTex(r'E = \\text{Energy}') in red, MathTex(r'm = \\text{Mass}') in green, and MathTex(r'c = \\text{Speed of Light}') in orange. Use .arrange(DOWN, buff=0.5) to ensure proper spacing between explanation lines. Add arrows connecting each variable. Duration: 20 seconds."

Return ONLY the enhanced prompt, nothing else.`

    const response = await fetch(
      `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-12-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: enhanceSystemPrompt },
            { role: 'user', content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Azure OpenAI API Error:', errorText)
      return NextResponse.json(
        { error: 'Failed to enhance prompt', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    const enhancedPrompt = data.choices[0].message.content.trim()

    return NextResponse.json({ enhancedPrompt })
  } catch (error: any) {
    console.error('Error in enhance-prompt API:', error)
    
    let errorMessage = 'Failed to enhance prompt'
    let errorDetails = error.message
    
    if (error.message?.includes('fetch') || error.message?.includes('ENOTFOUND')) {
      errorMessage = 'Cannot connect to Azure OpenAI'
      errorDetails = 'Check your AZURE_OPENAI_ENDPOINT and network connection.'
    } else if (error.message?.includes('401') || error.message?.includes('403')) {
      errorMessage = 'Authentication failed'
      errorDetails = 'Check your AZURE_OPENAI_API_KEY is valid.'
    }
    
    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    )
  }
}
