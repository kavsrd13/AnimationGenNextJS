import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { enhancedPrompt } = await request.json()

    if (!enhancedPrompt || typeof enhancedPrompt !== 'string') {
      return NextResponse.json(
        { error: 'Invalid enhanced prompt provided' },
        { status: 400 }
      )
    }

    const apiKey = process.env.AZURE_OPENAI_API_KEY
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME
    const animationServerUrl = process.env.ANIMATION_SERVER_URL

    if (!apiKey || !endpoint || !deploymentName || !animationServerUrl) {
      return NextResponse.json(
        { error: 'Configuration missing' },
        { status: 500 }
      )
    }

    // Step 1: Generate Manim code using Azure OpenAI
    const codeSystemPrompt = `You are a Manim code generator. Generate clean, working Python code.

⚠️ CRITICAL: LaTeX is NOT installed. You MUST NOT use MathTex() or Tex() at all.

MANDATORY RULES:
1. Output ONLY executable Python code (no markdown, no \`\`\`python blocks, no explanations)
2. Always start with: from manim import *
3. Class must be named: GeneratedScene(Scene)
4. Use construct(self) method
5. Keep it SIMPLE - prefer basic shapes and text

FOR TEXT (REQUIRED FOR ALL TEXT/MATH):
- Use Text("message", font_size=36, color=WHITE) for ALL text
- Use Unicode symbols for math: ×, ÷, ², ³, √, π, ∑, ∫, ≈, ≤, ≥, ∞
- Examples: Text("E=mc²"), Text("a² + b² = c²"), Text("∫ f(x)dx")
- NEVER use MathTex() or Tex() - they will fail without LaTeX

FOR SHAPES:
- Circle(), Square(), Rectangle(), Line(), Arrow(), Dot(), Polygon()
- Set color: Circle(color=BLUE, radius=1)
- Set position: .shift(UP), .move_to(ORIGIN), .next_to(other, RIGHT)

FOR ANIMATIONS:
- self.play(Write(text)) - for text appearing
- self.play(Create(shape)) - for shapes appearing
- self.play(FadeIn(object)) - fade in
- self.play(FadeOut(object)) - fade out
- self.play(object.animate.shift(UP)) - move object
- self.play(Transform(obj1, obj2)) - morph objects
- self.wait(1) - pause for 1 second

BEST PRACTICES:
- Define ALL objects before using them in animations
- Use clear variable names
- Keep total animation under 15 seconds
- Break complex ideas into 3-5 simple steps
- Test each object is created before animating it

GOOD EXAMPLE:
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Using Unicode for math
        title = Text("E=mc²", font_size=48, color=YELLOW)
        formula = Text("Energy = Mass × Speed²", font_size=36)
        formula.next_to(title, DOWN)

        self.play(Write(title))
        self.wait(0.5)
        self.play(FadeIn(formula))
        self.wait(1)

BAD EXAMPLE (DON'T DO THIS):
- equation = MathTex(r"E=mc^2")  # ❌ FORBIDDEN - LaTeX not installed
- tex = Tex("Hello")  # ❌ FORBIDDEN - LaTeX not installed`

    const codeResponse = await fetch(
      `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=2024-12-01-preview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: codeSystemPrompt },
            { role: 'user', content: enhancedPrompt },
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      }
    )

    if (!codeResponse.ok) {
      const errorText = await codeResponse.text()
      console.error('Azure OpenAI Code Generation Error:', errorText)
      return NextResponse.json(
        { error: 'Failed to generate code', details: errorText },
        { status: codeResponse.status }
      )
    }

    const codeData = await codeResponse.json()
    let generatedCode = codeData.choices[0].message.content.trim()

    // Clean up code if it has markdown formatting
    if (generatedCode.includes('```python')) {
      generatedCode = generatedCode
        .replace(/```python\n?/g, '')
        .replace(/```\n?/g, '')
        .trim()
    } else if (generatedCode.includes('```')) {
      generatedCode = generatedCode
        .replace(/```\n?/g, '')
        .trim()
    }

    // Step 2: Send code to animation server for rendering
    const renderResponse = await fetch(`${animationServerUrl}/generate_animation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manim_code: generatedCode,
      }),
    })

    if (!renderResponse.ok) {
      const errorData = await renderResponse.json()
      console.error('Animation Server Error:', errorData)
      return NextResponse.json(
        { 
          error: 'Failed to render animation', 
          details: errorData.error || errorData.stderr_log || 'Unknown error',
          code: generatedCode 
        },
        { status: renderResponse.status }
      )
    }

    const renderData = await renderResponse.json()
    console.log('Animation Server Response:', JSON.stringify(renderData).substring(0, 200))

    // Validate response has video data
    if (!renderData.video_data) {
      console.error('Missing video_data in response:', renderData)
      
      // If there's an error from the server, return that
      if (renderData.error) {
        return NextResponse.json(
          { 
            error: 'Animation rendering failed', 
            details: renderData.error,
            code: generatedCode 
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Animation server did not return video data', 
          details: `Response keys: ${Object.keys(renderData).join(', ')}`,
          code: generatedCode 
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      code: generatedCode,
      videoBase64: renderData.video_data,
      renderTime: renderData.render_time || 0,
      videoSize: renderData.video_size || 0,
    })
  } catch (error: any) {
    console.error('Error in generate-animation API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
