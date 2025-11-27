import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check for API key
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Google API key not configured',
          hint: 'Add GOOGLE_API_KEY to your .env.local file'
        },
        { status: 500 }
      )
    }

    console.log('API Key found:', apiKey.substring(0, 10) + '...')

    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(apiKey)

    // Try the most common model names for Google AI Studio free tier
    const modelsToTry = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
      'gemini-pro-vision',
      'gemini-pro',
      'models/gemini-1.5-flash-latest',
      'models/gemini-1.5-flash',
      'models/gemini-pro-vision',
      'models/gemini-pro'
    ]

    let workingModel = null
    let testResponse = null

    for (const modelName of modelsToTry) {
      try {
        console.log(`Testing model: ${modelName}`)
        const model = genAI.getGenerativeModel({ model: modelName })
        const result = await model.generateContent('Say "API is working!" if you can read this.')
        const response = await result.response
        testResponse = response.text()
        workingModel = modelName
        console.log(`✓ Model ${modelName} works!`)
        break
      } catch (err) {
        console.log(`✗ Model ${modelName} failed:`, err instanceof Error ? err.message : err)
        continue
      }
    }

    if (workingModel) {
      return NextResponse.json({
        success: true,
        message: 'Gemini API is working!',
        workingModel,
        response: testResponse
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'None of the common model names worked',
        triedModels: modelsToTry,
        hint: 'Your API key might not have access to Gemini models. Try creating a new key at https://aistudio.google.com/app/apikey'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Gemini API Test Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: error,
        hint: 'Make sure your API key is activated at https://makersuite.google.com/app/apikey'
      },
      { status: 500 }
    )
  }
}
