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

Guidelines for Educational Animations:
1. Break down complex concepts into clear, sequential steps that build understanding
2. Specify use of MathTex() for equations and mathematical expressions
3. Keep animations focused (10-30 seconds) - long enough to teach, short enough to maintain attention
4. Use visual hierarchies: titles, main concepts, supporting details
5. For math/equations, specify LaTeX notation: E=mc^2, \\frac{a}{b}, \\sqrt{x}, \\int, \\sum, etc.
6. ALWAYS use MathTex() and Tex() for professional mathematical notation
7. Specify colors that enhance learning: highlight key formulas, use contrasts for different concepts
8. Include strategic pauses for student comprehension
9. Suggest visual aids: arrows showing relationships, boxes highlighting key points, step-by-step reveals

Example Teaching Prompts:

User: "gradient descent finding minimum"
Enhanced: "Create an educational animation showing gradient descent optimization. Start with a title using Tex() 'Gradient Descent Algorithm'. Display a blue parabola using a parametric curve representing f(x) = x². Show the mathematical formula using MathTex(r'f(x) = x^2') in the top corner. Animate a red dot starting at a high point on the curve with initial position label using MathTex(r'x_0'). Show the dot taking discrete steps down the curve, with each step showing a small tangent line indicating the gradient direction. Display the update rule using MathTex(r'x_{n+1} = x_n - \\alpha \\nabla f(x_n)') appearing when the dot moves. The dot should converge to the minimum at the bottom. Duration: 18 seconds with pauses at key steps."

User: "explain E=mc²"
Enhanced: "Create a teaching animation for Einstein's famous equation. Start with a title using Tex(r'Einstein\\'s Energy-Mass Equivalence') at the top. Display the complete equation using MathTex(r'E = mc^2', font_size=60) in the center. Then break it down step-by-step: first highlight 'E' and show MathTex(r'E = \\text{Energy (Joules)}') appear below it. Then highlight 'm' and show MathTex(r'm = \\text{Mass (kg)}'). Finally highlight 'c²' and show MathTex(r'c = 3 \\times 10^8 \\text{ m/s}') with a note explaining c is the speed of light. Use arrows to connect each variable to its meaning. Use distinct colors: blue for the main equation, red for energy, green for mass, orange for the speed of light. Duration: 20 seconds."

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
