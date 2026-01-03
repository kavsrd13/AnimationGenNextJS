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
      const missing = []
      if (!apiKey) missing.push('AZURE_OPENAI_API_KEY')
      if (!endpoint) missing.push('AZURE_OPENAI_ENDPOINT')
      if (!deploymentName) missing.push('AZURE_OPENAI_DEPLOYMENT_NAME')
      if (!animationServerUrl) missing.push('ANIMATION_SERVER_URL')
      
      return NextResponse.json(
        { 
          error: 'Environment configuration missing', 
          details: `Missing: ${missing.join(', ')}. Please check your .env.local file.` 
        },
        { status: 500 }
      )
    }

    // Step 1: Generate Manim code using Azure OpenAI
    const codeSystemPrompt = `You are an expert Manim code generator specializing in creating educational animations for teaching concepts to students.

✅ LaTeX is FULLY INSTALLED and available. You SHOULD use MathTex() and Tex() for mathematical expressions.

MANDATORY RULES:
1. Output ONLY executable Python code (no markdown, no ```python blocks, no explanations)
2. Always start with: from manim import *
3. Class must be named: GeneratedScene(Scene)
4. Use construct(self) method
5. Focus on EDUCATIONAL clarity - animations should help students understand concepts

FOR TEXT AND MATHEMATICS:
- Use MathTex() for mathematical expressions and equations: MathTex(r"E = mc^2", font_size=48)
- Use Tex() for LaTeX formatted text: Tex(r"Pythagorean Theorem", font_size=40)
- Use Text() for simple labels and non-mathematical text: Text("Step 1", font_size=36)
- Always use raw strings (r"...") with LaTeX commands
- Common LaTeX: \\frac{a}{b}, \\sqrt{x}, \\sum, \\int, \\alpha, \\theta, \\pi, \\infty
- For matrices: MathTex(r"\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}")

FOR SHAPES AND VISUAL ELEMENTS:
- Circle(), Square(), Rectangle(), Line(), Arrow(), Dot(), Polygon()
- NumberPlane() for coordinate systems, Axes() for graphs
- Set color: Circle(color=BLUE, radius=1)
- Use VGroup() to group related objects together

CRITICAL - POSITIONING TO AVOID OVERLAPS:
- ALWAYS position elements explicitly - never leave them at default ORIGIN
- Use .to_edge(UP/DOWN/LEFT/RIGHT) to place elements at screen edges
- Use .next_to(other_object, direction, buff=0.5) with buff for spacing
- Use .shift(UP*2, RIGHT*3) for precise positioning
- Use .arrange(DOWN, buff=0.5) for VGroups to auto-space elements
- Use .move_to(position) to center elements at specific locations
- Common positions: UP*3, DOWN*2, LEFT*4, RIGHT*4, ORIGIN
- Add buffer spacing: buff=0.5 (small), buff=1.0 (medium), buff=1.5 (large)
- Scale text if needed: .scale(0.8) to prevent edge overflow

LAYOUT BEST PRACTICES:
- Title at top: title.to_edge(UP, buff=0.5)
- Main content in center: equation.move_to(ORIGIN) or equation.shift(UP)
- Explanations below: explanation.next_to(equation, DOWN, buff=1)
- Side annotations: label.next_to(shape, RIGHT, buff=0.7)
- Multiple items: VGroup(item1, item2, item3).arrange(DOWN, buff=0.6)

FOR EDUCATIONAL ANIMATIONS:
- self.play(Write(equation)) - for equations appearing (great for teaching)
- self.play(Create(shape)) - for shapes appearing
- self.play(FadeIn(object)) - fade in elements
- self.play(FadeOut(object)) - fade out elements
- self.play(Transform(obj1, obj2)) - show transformations (excellent for teaching)
- self.play(Indicate(object)) - highlight important elements
- self.play(object.animate.shift(UP)) - move objects
- self.wait(1) - pause for student comprehension

EDUCATIONAL BEST PRACTICES:
- Start with the main concept or title positioned at the top
- Build understanding step-by-step (don't show everything at once)
- Use colors to distinguish different elements (RED for important, BLUE for formulas, GREEN for solutions)
- Add pauses (self.wait()) after each key concept
- Use arrows and annotations to guide student attention
- Keep animations clear and at a pace students can follow
- ALWAYS ensure proper spacing between elements to prevent overlaps
- Test positioning: title at top, main content in center, details below
- Total duration: 10-20 seconds for simple concepts, up to 30 seconds for complex topics

GOOD EDUCATIONAL EXAMPLE (NO OVERLAPS):
from manim import *

class GeneratedScene(Scene):
    def construct(self):
        # Teaching Einstein's equation with proper spacing
        title = Tex(r"Einstein's Energy-Mass Equivalence", font_size=40, color=YELLOW)
        title.to_edge(UP, buff=0.5)  # Position at top with buffer
        
        equation = MathTex(r"E = mc^2", font_size=60, color=BLUE)
        equation.shift(UP*0.5)  # Slightly above center
        
        # Group explanations with spacing
        explanation = VGroup(
            MathTex(r"E", r"=", r"\\text{Energy}", font_size=36, color=RED),
            MathTex(r"m", r"=", r"\\text{Mass}", font_size=36, color=GREEN),
            MathTex(r"c", r"=", r"\\text{Speed of Light}", font_size=36, color=ORANGE)
        ).arrange(DOWN, buff=0.5)  # Auto-space with buffer
        explanation.next_to(equation, DOWN, buff=1.2)  # Position below equation with spacing
        
        self.play(Write(title))
        self.wait(0.5)
        self.play(Write(equation))
        self.wait(1)
        self.play(FadeIn(explanation, shift=UP))
        self.wait(2)

BEST PRACTICES FOR STUDENT LEARNING:
- Use MathTex() and Tex() for professional mathematical notation
- Break complex formulas into parts students can digest
- Use colors to create visual connections
- Include brief pauses for comprehension
- Position all elements explicitly with proper spacing to avoid overlaps
- Build from simple to complex gradually`

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
    
    // Provide more specific error messages
    let errorMessage = 'Internal server error'
    let errorDetails = error.message
    
    if (error.message?.includes('fetch')) {
      errorMessage = 'Network error'
      errorDetails = 'Failed to connect to Azure OpenAI or Animation Server. Check your network connection and server URLs.'
    } else if (error.message?.includes('JSON')) {
      errorMessage = 'Invalid response format'
      errorDetails = 'Received invalid data from server. This may be a temporary issue.'
    } else if (error.message?.includes('timeout')) {
      errorMessage = 'Request timeout'
      errorDetails = 'The server took too long to respond. Try again or simplify your animation.'
    }
    
    return NextResponse.json(
      { error: errorMessage, details: errorDetails },
      { status: 500 }
    )
  }
}
