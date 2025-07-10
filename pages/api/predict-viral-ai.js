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

    // Check if Gemini AI is configured
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Gemini API key not configured' 
      })
    }

    console.log('🤖 Starting AI viral prediction analysis...')
    console.log('Content:', content.trim())
    console.log('Creator:', creator || 'none')
    console.log('Creator Data:', creatorData ? 'available' : 'not available')

    // Build the prompt with only real data
    let prompt = `You are an expert social media analyst. Analyze this content for viral potential:

CONTENT: "${content.trim()}"
`

    if (creator) {
      prompt += `CREATOR HANDLE: @${creator}\n`
    }

    if (creatorData && creatorData.followerCount) {
      prompt += `CREATOR DATA (from LunarCrush):
- Followers: ${creatorData.followerCount.toLocaleString()}
- Handle: @${creatorData.handle}
${creatorData.influenceScore ? `- Influence Score: ${creatorData.influenceScore}` : ''}
${creatorData.engagement ? `- Engagement Rate: ${creatorData.engagement}` : ''}
`
    }

    prompt += `
Provide a realistic viral probability analysis. Respond ONLY in valid JSON format:
{
  "viralProbability": number (0-100),
  "confidenceScore": number (0-100),
  "expectedEngagement": number,
  "viralCategory": "Ultra High|High|Moderate|Low",
  "recommendations": ["suggestion1", "suggestion2", "suggestion3"]
}

IMPORTANT: 
- Base analysis on content quality, sentiment, trending topics
- Consider creator influence if provided
- Be realistic but not overly conservative
- NO fake data - only real analysis`

    console.log('🚀 Sending to Gemini AI...')
    
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log('✅ Gemini AI response received:', text)

    // Parse JSON response - STRICT NO FALLBACKS
    let analysis
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response')
      }
      analysis = JSON.parse(jsonMatch[0])
      console.log('✅ Parsed AI analysis:', analysis)
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError)
      console.error('Raw AI response:', text)
      return res.status(500).json({ 
        success: false, 
        error: 'AI analysis failed to return valid results. Please try again.' 
      })
    }

    // Validate required fields - NO DEFAULTS
    const requiredFields = ['viralProbability', 'confidenceScore', 'viralCategory']
    for (const field of requiredFields) {
      if (analysis[field] === undefined || analysis[field] === null) {
        console.error(`❌ Missing required field: ${field}`)
        return res.status(500).json({ 
          success: false, 
          error: `AI analysis incomplete - missing ${field}` 
        })
      }
    }

    // Enhance with creator data ONLY if available and valid
    if (creatorData && creatorData.followerCount && creatorData.followerCount > 0) {
      console.log('✅ Enhancing analysis with real creator data...')
      
      // Calculate expected engagement based on real follower data
      const baseEngagementRate = 0.02 // 2% base engagement rate
      const viralBoost = analysis.viralProbability / 100
      analysis.expectedEngagement = Math.floor(
        creatorData.followerCount * baseEngagementRate * viralBoost
      )
      
      // Boost viral probability for high-follower accounts
      if (creatorData.followerCount > 50000000) {
        analysis.viralProbability = Math.min(100, analysis.viralProbability + 10)
        console.log('✅ Boosted viral probability for mega creator (50M+ followers)')
      } else if (creatorData.followerCount > 10000000) {
        analysis.viralProbability = Math.min(100, analysis.viralProbability + 5)
        console.log('✅ Boosted viral probability for major creator (10M+ followers)')
      }
    } else {
      console.log('ℹ️ No creator data available for engagement calculation')
    }

    const responseData = {
      success: true,
      viralProbability: analysis.viralProbability,
      confidenceScore: analysis.confidenceScore,
      expectedEngagement: analysis.expectedEngagement || null,
      viralCategory: analysis.viralCategory,
      recommendations: analysis.recommendations || [],
      analysisSource: 'Google Gemini 2.0 Flash',
      timestamp: new Date().toISOString(),
      hasCreatorData: !!(creatorData && creatorData.followerCount)
    }

    console.log('✅ Returning final analysis:', responseData)
    res.status(200).json(responseData)

  } catch (error) {
    console.error('❌ Viral prediction error:', error)
    
    if (error.message.includes('API key')) {
      return res.status(500).json({ 
        success: false, 
        error: 'Google Gemini API configuration error' 
      })
    }
    
    res.status(500).json({ 
      success: false, 
      error: `Viral prediction failed: ${error.message}` 
    })
  }
}
