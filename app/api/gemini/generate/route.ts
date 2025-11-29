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
      return NextResponse.json(
        { error: 'Title and image URL are required' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      )
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.statusText}` },
        { status: 400 }
      )
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const base64Image = Buffer.from(imageBuffer).toString('base64')
    
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // *** FIX: Use the specific pinned version ***
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are an art curator. Write two descriptions for a digital artwork titled '${title}'.
1. A 'short' catchy one-liner (max 15 words).
2. A 'long' engaging paragraph (approx 50-80 words) describing the visual style and mood.
Return ONLY valid JSON format: { "short": "...", "long": "..." }`

    console.log('Calling Gemini API...')

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: imageResponse.headers.get('content-type') || 'image/jpeg',
        },
      },
    ])

    const response = await result.response
    const text = response.text()
    console.log('Gemini response:', text)

    // Parse the JSON response
    const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim()
    const generatedContent: GenerateResponse = JSON.parse(cleanedText)

    return NextResponse.json(generatedContent)

  } catch (error: any) {
    console.error('Error generating descriptions:', error)
    // Return the REAL error message so we can debug
    return NextResponse.json(
      {
        error: 'Failed to generate descriptions',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    )
  }
}