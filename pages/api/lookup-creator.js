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

    // Clean the creator handle - remove @ symbol if present
    const cleanCreator = creator.trim().replace(/^@/, '')
    console.log(`🔍 Looking up creator: ${cleanCreator} using LLM-orchestrated MCP calls`)

    // Check if API keys are configured
    if (!process.env.LUNARCRUSH_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'LunarCrush API key not configured',
      })
    }
    
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google Gemini API key not configured',
      })
    }

    // Create MCP client connection
    mcpClient = await createMcpClient()
    
    // Use LLM to orchestrate MCP tool calls
    const orchestrationPrompt = `You are a social media data analyst. I need comprehensive data for creator "${cleanCreator}".

AVAILABLE MCP TOOLS:
- Creator: Get creator metrics (screenName, network)
- Topic: Get topic/keyword data (topic)

TASK: Create a plan to get complete social media data for "${cleanCreator}"

Respond with JSON array of tool calls:
[
  {
    "tool": "Creator", 
    "args": {"screenName": "${cleanCreator}", "network": "x"},
    "reason": "Get follower count and engagement metrics"
  }
]

Use exact tool names and proper parameters. No explanations, just JSON array.`

    console.log('🤖 Using LLM to orchestrate MCP calls...')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })
    const orchestrationResult = await model.generateContent(orchestrationPrompt)
    const orchestrationText = orchestrationResult.response.text()
    
    // Parse LLM orchestration response
    let toolCalls
    try {
      const jsonMatch = orchestrationText.match(/\[[\s\S]*\]/)
      if (!jsonMatch) {
        throw new Error('No valid JSON array found in LLM response')
      }
      toolCalls = JSON.parse(jsonMatch[0])
    } catch (parseError) {
      console.error('❌ Failed to parse LLM orchestration:', parseError)
      return res.status(500).json({
        success: false,
        error: 'LLM failed to create proper tool orchestration plan'
      })
    }

    console.log('🎯 LLM orchestrated tool calls:', toolCalls)

    // Execute the LLM-orchestrated tool calls
    let combinedResults = []
    for (const toolCall of toolCalls) {
      try {
        const result = await executeToolCall(mcpClient, toolCall.tool, toolCall.args)
        combinedResults.push({
          tool: toolCall.tool,
          args: toolCall.args,
          reason: toolCall.reason,
          result: result
        })
      } catch (toolError) {
        console.error(`❌ Tool ${toolCall.tool} failed:`, toolError)
        // Continue with other tools
      }
    }

    if (combinedResults.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No data found for @${cleanCreator} in LunarCrush database`,
      })
    }

    // Parse results from LLM-orchestrated MCP calls
    let followerCount = 0
    let engagements = 0
    
    for (const toolResult of combinedResults) {
      if (toolResult.result && toolResult.result.content) {
        for (const content of toolResult.result.content) {
          if (content.type === 'text') {
            const text = content.text
            console.log(`📝 ${toolResult.tool} Response:`, text)
            
            // Extract follower count
            const followerMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*followers/i) || 
                                 text.match(/followers[:\s]*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i) ||
                                 text.match(/Followers:\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i)
            
            if (followerMatch) {
              followerCount = Math.max(followerCount, parseInt(followerMatch[1].replace(/,/g, '')))
            }

            // Extract engagements
            const engagementMatch = text.match(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*engagements/i) ||
                                   text.match(/Engagements:\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)/i)
            if (engagementMatch) {
              engagements = Math.max(engagements, parseInt(engagementMatch[1].replace(/,/g, '')))
            }
          }
        }
      }
    }

    // Validate we have real data
    if (followerCount === 0) {
      return res.status(404).json({
        success: false,
        error: `No follower data found for @${cleanCreator} in LunarCrush database`,
      })
    }

    console.log(`✅ LLM-orchestrated lookup found @${cleanCreator}: ${followerCount.toLocaleString()} followers`)

    // Return standardized creator data
    res.status(200).json({
      success: true,
      data: {
        handle: cleanCreator,
        followerCount: followerCount,
        followers: followerCount,
        engagements: engagements,
        influenceScore: null,
        engagement: null,
        verified: false,
        source: 'LLM-Orchestrated MCP Analysis'
      },
      metadata: {
        source: 'LunarCrush MCP via LLM Orchestration',
        toolsUsed: toolCalls.map(t => t.tool),
        requestTime: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('❌ LLM-Orchestrated Creator Lookup Error:', error)
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
