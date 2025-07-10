import { createMcpClient, executeToolCall } from '../../lib/mcp-client.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  let mcpClient = null

  try {
    const { creator } = req.body

    if (!creator || !creator.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Creator handle is required',
      })
    }

    const cleanCreator = creator.trim().replace(/^@/, '')
    console.log(`🔍 Optimized creator lookup for: ${cleanCreator}`)

    if (!process.env.LUNARCRUSH_API_KEY || !process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'API keys not configured',
      })
    }

    mcpClient = await createMcpClient()
    
    // Optimized orchestration prompt with strategic thinking
    const orchestrationPrompt = `ROLE: Social media data strategist

OBJECTIVE: Get comprehensive creator data for "${cleanCreator}"

AVAILABLE TOOLS:
- Creator: {"screenName": "handle", "network": "x"} → follower metrics, engagement data
- Topic: {"topic": "handle"} → social sentiment, trending data  

STRATEGY: Design optimal tool sequence for complete social analysis.

FEW-SHOT EXAMPLE:
For "elonmusk":
[
  {
    "tool": "Creator",
    "args": {"screenName": "elonmusk", "network": "x"},
    "reason": "Primary follower and engagement metrics"
  },
  {
    "tool": "Topic", 
    "args": {"topic": "elon musk"},
    "reason": "Social sentiment and trending analysis"
  }
]

YOUR TASK: Create tool sequence for "${cleanCreator}". Return JSON array only.`

    console.log('🤖 Using optimized LLM orchestration...')
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent tool selection
        topK: 20,
        maxOutputTokens: 512,
      }
    })
    
    const orchestrationResult = await model.generateContent(orchestrationPrompt)
    const orchestrationText = orchestrationResult.response.text()
    
    // Enhanced tool call parsing
    let toolCalls
    try {
      const jsonMatch = orchestrationText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        // Fallback to basic tool call if orchestration fails
        toolCalls = [{
          tool: "Creator",
          args: {"screenName": cleanCreator, "network": "x"},
          reason: "Get basic creator metrics"
        }]
      } else {
        toolCalls = JSON.parse(jsonMatch[0])
      }
    } catch (parseError) {
      console.error('❌ Orchestration parsing failed:', parseError)
      // Fallback strategy
      toolCalls = [{
        tool: "Creator",
        args: {"screenName": cleanCreator, "network": "x"},
        reason: "Fallback creator lookup"
      }]
    }

    console.log('🎯 Optimized tool calls:', toolCalls)

    // Execute orchestrated tool calls with better error handling
    let combinedResults = []
    for (const toolCall of toolCalls) {
      try {
        const result = await executeToolCall(mcpClient, toolCall.tool, toolCall.args)
        combinedResults.push({
          tool: toolCall.tool,
          args: toolCall.args,
          reason: toolCall.reason,
          result: result,
          success: true
        })
      } catch (toolError) {
        console.error(`❌ Tool ${toolCall.tool} failed:`, toolError)
        combinedResults.push({
          tool: toolCall.tool,
          args: toolCall.args,
          reason: toolCall.reason,
          error: toolError.message,
          success: false
        })
      }
    }

    if (combinedResults.filter(r => r.success).length === 0) {
      return res.status(404).json({
        success: false,
        error: `No data found for @${cleanCreator} in LunarCrush database`,
      })
    }

    // Enhanced data extraction with multiple patterns
    let followerCount = 0
    let engagements = 0
    let sentiment = null
    
    for (const toolResult of combinedResults.filter(r => r.success)) {
      if (toolResult.result && toolResult.result.content) {
        for (const content of toolResult.result.content) {
          if (content.type === 'text') {
            const text = content.text
            console.log(`📝 ${toolResult.tool} Response:`, text.substring(0, 200) + '...')
            
            // Enhanced follower extraction patterns
            const followerPatterns = [
              /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*followers/i,
              /followers[:\s]*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i,
              /Followers:\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i,
              /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)M?\s*followers/i
            ]
            
            for (const pattern of followerPatterns) {
              const match = text.match(pattern)
              if (match) {
                const count = parseFloat(match[1].replace(/,/g, ''))
                const multiplier = text.includes('M') || text.includes('million') ? 1000000 : 1
                followerCount = Math.max(followerCount, Math.floor(count * multiplier))
                break
              }
            }

            // Extract engagement data
            const engagementPattern = /(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*engagements?/i
            const engagementMatch = text.match(engagementPattern)
            if (engagementMatch) {
              engagements = Math.max(engagements, parseInt(engagementMatch[1].replace(/,/g, '')))
            }

            // Extract sentiment if available
            if (toolResult.tool === 'Topic') {
              const sentimentPattern = /(bullish|bearish|positive|negative|neutral)/i
              const sentimentMatch = text.match(sentimentPattern)
              if (sentimentMatch) {
                sentiment = sentimentMatch[1].toLowerCase()
              }
            }
          }
        }
      }
    }

    if (followerCount === 0) {
      return res.status(404).json({
        success: false,
        error: `No follower data found for @${cleanCreator} in LunarCrush database`,
      })
    }

    console.log(`✅ Optimized lookup found @${cleanCreator}: ${followerCount.toLocaleString()} followers`)

    // Enhanced response with orchestration metadata
    res.status(200).json({
      success: true,
      data: {
        handle: cleanCreator,
        followerCount: followerCount,
        followers: followerCount,
        engagements: engagements || null,
        sentiment: sentiment,
        influenceScore: null,
        engagement: null,
        verified: false,
        source: 'Optimized LLM-Orchestrated MCP Analysis'
      },
      metadata: {
        source: 'LunarCrush MCP via Optimized LLM Orchestration',
        toolsExecuted: combinedResults.length,
        successfulTools: combinedResults.filter(r => r.success).length,
        orchestrationStrategy: toolCalls.map(t => `${t.tool}: ${t.reason}`),
        requestTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ Optimized Creator Lookup Error:', error)
    return res.status(500).json({
      success: false,
      error: `Creator lookup failed: ${error.message}`,
    })
    
  } finally {
    if (mcpClient && mcpClient.close) {
      try {
        await mcpClient.close()
        console.log('🔌 MCP client connection closed')
      } catch (closeError) {
        console.warn('⚠️ Error closing MCP client:', closeError.message)
      }
    }
  }
}
