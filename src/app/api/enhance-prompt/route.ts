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

    const enhanceSystemPrompt = `You are an expert prompt engineer for python animations.

Your job: Convert the user's casual description into a DETAILED, SPECIFIC prompt for python code generation.

IMPORTANT: LaTeX is NOT available. All math must use plain text with Unicode symbols.

Guidelines:
1. Break down complex ideas into 3-5 simple, sequential steps
2. Specify colors, sizes, and positions where helpful
3. Keep animations SHORT (5-15 seconds total)
4. Use simple shapes and text rather than complex graphics
5. For math/equations, ALWAYS use Unicode symbols: ×, ÷, ², ³, √, π, ∑, ∫, ≈, ≤, ≥, ∞, α, β, γ, Δ, etc.
6. NEVER suggest LaTeX, MathTex, or Tex - use Text() only
7. Describe visual elements clearly (circles, squares, arrows, text)
8. Avoid overly complex movements or transformations
9. Be concrete and specific about what should appear on screen

Example:
User: "gradient descent finding minimum"
Enhanced: "Create a simple parabola curve in blue. Show a red dot starting at a high point on the curve. Animate the dot moving down the curve in small steps, following the slope downward. Add a text label 'Gradient Descent' at the top. The dot should stop at the bottom (minimum) of the curve. Total duration: 8 seconds."

User: "explain E=mc²"
Enhanced: "Show the text 'E=mc²' in large font at center using Unicode superscript. Then split it into three parts: 'E' (energy) in yellow on left, '=' in white at center, 'mc²' (mass × speed²) in blue on right. Use arrows to show how mass times speed of light squared equals energy. Duration: 10 seconds."

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
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
