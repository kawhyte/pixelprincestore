import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

interface GenerateRequest {
  title: string
  imageUrl: string
}

interface GenerateResponse {
  short: string
  long: string
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: GenerateRequest = await request.json()
    const { title, imageUrl } = body

    console.log('Received request:', { title, imageUrl })

    // Validate inputs
    if (!title || !imageUrl) {
      console.error('Missing required fields:', { title: !!title, imageUrl: !!imageUrl })
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      console.error('Google API key not configured')
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      )
    }

    console.log('API key found, fetching image...')

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      console.error('Failed to fetch image:', imageResponse.status, imageResponse.statusText)
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.statusText}` },
        { status: 400 }
      )
    }

    console.log('Image fetched successfully, converting to base64...')
    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    console.log('Image converted to base64, calling Gemini API...')

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Create the prompt
    const prompt = `You are an art curator. Write two descriptions for a digital artwork titled '${title}'.
1. A 'short' catchy one-liner (max 15 words).
2. A 'long' engaging paragraph (approx 50-80 words) describing the visual style and mood.
Return ONLY valid JSON format: { "short": "...", "long": "..." }`

    // Generate content with the image
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
        },
      },
    ])

    console.log('Gemini API called, processing response...')
    const response = await result.response
    const text = response.text()
    console.log('Gemini response:', text)

    // Parse the JSON response
    // Clean the response text (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    const generatedContent: GenerateResponse = JSON.parse(cleanedText)

    // Validate the response structure
    if (!generatedContent.short || !generatedContent.long) {
      return NextResponse.json(
        { error: 'Invalid response format from Gemini' },
        { status: 500 }
      )
    }

    return NextResponse.json(generatedContent)
  } catch (error) {
    console.error('Error generating descriptions:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate descriptions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
