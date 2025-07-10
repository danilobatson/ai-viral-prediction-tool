import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    })
  }

  try {
    const { content, creator, creatorData } = req.body

    if (!content || !content.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Content is required for viral prediction' 
      })
    }

    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Gemini API key not configured' 
      })
    }

    console.log('🤖 Starting optimized viral prediction analysis...')

    // Optimized prompt using viral psychology principles
    const prompt = `ROLE: Expert viral content analyst with psychology background

VIRAL SCIENCE FRAMEWORK:
- Ultra High (75-85%): 1M+ engagements, global trending, mass media pickup
- High (60-74%): 100K-999K engagements, category trending
- Moderate (40-59%): 10K-99K engagements, niche viral
- Low (0-39%): <10K engagements, minimal reach

CONTENT: "${content.trim()}"
${creator ? `CREATOR: @${creator}` : ''}
${creatorData ? `FOLLOWERS: ${creatorData.followerCount.toLocaleString()}` : ''}

VIRAL PSYCHOLOGY FACTORS:
✓ Emotional triggers (surprise, anger, joy, fear)
✓ Social currency (makes people look good sharing)
✓ Practical value (useful information)
✓ Stories & narrative (human connection)
✓ Public visibility (observable behavior)
✓ Timing alignment (current events, trends)

ANALYZE using viral psychology + creator influence + current trends.

OUTPUT (valid JSON only):
{
  "viralProbability": <0-85>,
  "confidenceScore": <0-95>,
  "expectedEngagement": <number>,
  "viralCategory": "<Ultra High|High|Moderate|Low>",
  "recommendations": ["<action1>", "<action2>", "<action3>"],
  "optimizedHashtags": ["<tag1>", "<tag2>", "<tag3>", "<tag4>", "<tag5>"],
  "optimalTiming": {
    "bestTime": "<time range EST>",
    "bestDays": "<day range>",
    "timezone": "EST"
  },
  "viralFactors": ["<psychology factor>", "<social factor>", "<content factor>"],
  "psychologyScore": {
    "emotional": <0-100>,
    "socialCurrency": <0-100>,
    "practicalValue": <0-100>,
    "story": <0-100>
  }
}

CONSTRAINTS: Max 85% probability. Be realistic. Always include optimization suggestions.`

    console.log('🚀 Sending optimized prompt to Gemini AI...')
    
    // Use consistent model across the app
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('✅ Optimized Gemini AI response received')

    // Enhanced JSON parsing with validation
    let analysis
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      analysis = JSON.parse(jsonMatch[0])
      
      // Validate required fields with better error messages
      const requiredFields = {
        'viralProbability': 'number',
        'confidenceScore': 'number', 
        'viralCategory': 'string',
        'recommendations': 'array',
        'optimizedHashtags': 'array'
      }
      
      for (const [field, type] of Object.entries(requiredFields)) {
        if (!analysis[field]) {
          throw new Error(`Missing required field: ${field}`)
        }
        if (type === 'array' && !Array.isArray(analysis[field])) {
          throw new Error(`Field ${field} must be an array`)
        }
        if (type === 'number' && typeof analysis[field] !== 'number') {
          throw new Error(`Field ${field} must be a number`)
        }
      }
      
      console.log('✅ Parsed and validated optimized AI analysis')
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      return res.status(500).json({ 
        success: false, 
        error: `AI analysis parsing failed: ${parseError.message}` 
      })
    }

    // Cap viral probability and enhance with creator data
    analysis.viralProbability = Math.min(85, analysis.viralProbability)

    if (creatorData && creatorData.followerCount > 0) {
      console.log('✅ Enhancing with real MCP creator data...')
      
      // More sophisticated engagement calculation
      const baseRate = creatorData.followerCount > 50000000 ? 0.025 : 
                      creatorData.followerCount > 10000000 ? 0.02 :
                      creatorData.followerCount > 1000000 ? 0.015 : 0.01
      
      const viralMultiplier = (analysis.viralProbability / 100)
      const psychologyBoost = analysis.psychologyScore ? 
        (analysis.psychologyScore.emotional + analysis.psychologyScore.socialCurrency) / 200 : 0.5
      
      analysis.expectedEngagement = Math.floor(
        creatorData.followerCount * baseRate * viralMultiplier * (1 + psychologyBoost)
      )
      
      // Slight realistic boost for mega creators
      if (creatorData.followerCount > 100000000) {
        analysis.viralProbability = Math.min(85, analysis.viralProbability + 3)
      }
    }

    const responseData = {
      success: true,
      ...analysis,
      analysisSource: 'Google Gemini 2.0 Flash (Psychology-Enhanced)',
      timestamp: new Date().toISOString(),
      hasCreatorData: !!(creatorData && creatorData.followerCount),
      dataSource: creatorData ? 'LLM-Orchestrated MCP' : 'Content Analysis Only',
      modelConfig: {
        model: 'gemini-2.0-flash-exp',
        temperature: 0.7,
        features: ['viral psychology', 'social science', 'trend analysis']
      }
    }

    console.log(`✅ Returning optimized analysis: ${responseData.viralProbability}% viral probability`)
    res.status(200).json(responseData)

  } catch (error) {
    console.error('❌ Optimized viral prediction error:', error)
    res.status(500).json({ 
      success: false, 
      error: `Viral prediction failed: ${error.message}` 
    })
  }
}
