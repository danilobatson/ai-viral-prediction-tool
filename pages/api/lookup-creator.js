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

    // Collect all MCP response text for LLM parsing
    let allMcpText = ''
    for (const toolResult of combinedResults) {
      if (toolResult.result && toolResult.result.content) {
        for (const content of toolResult.result.content) {
          if (content.type === 'text') {
            allMcpText += content.text + '\n\n'
          }
        }
      }
    }

    console.log('===== RAW MCP RESPONSE FOR LLM PARSING =====')
    console.log(allMcpText)
    console.log('============================================')

    // Use LLM to parse the MCP response data
    const parsingPrompt = `You are a data extraction specialist. Parse this social media creator data and extract specific metrics.

MCP RESPONSE DATA:
${allMcpText}

TASK: Extract these exact data points and return as JSON:
{
  "handle": "creator_username_without_@",
  "followerCount": number_of_followers_as_integer,
  "engagements": total_engagements_as_integer,
  "verified": true_or_false_if_mentioned,
  "platform": "twitter_or_x",
  "success": true
}

PARSING RULES:
- Look for "Followers:" or "followers" and extract the number (remove commas)
- Look for "Engagements:" or "engagements" and extract the number (remove commas)  
- Convert all text numbers like "111,042,572" to integers like 111042572
- If a data point is not found, use 0 for numbers and false for booleans
- Only return the JSON object, no explanations

Creator handle: ${cleanCreator}`

    console.log('🧠 Using LLM to parse MCP response data...')
    const parsingResult = await model.generateContent(parsingPrompt)
    const parsingText = parsingResult.response.text()
    
    console.log('🎯 LLM parsing result:', parsingText)

    // Extract and validate JSON from LLM response
    let creatorData
    try {
      const jsonMatch = parsingText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No valid JSON found in LLM parsing response')
      }
      creatorData = JSON.parse(jsonMatch[0])
      
      // Validate required fields
      if (!creatorData.handle || typeof creatorData.followerCount !== 'number') {
        throw new Error('LLM parsing did not return valid creator data structure')
      }
      
    } catch (parseError) {
      console.error('❌ Failed to parse LLM extraction:', parseError)
      console.error('Raw LLM response:', parsingText)
      return res.status(500).json({
        success: false,
        error: 'LLM failed to extract creator data from MCP response'
      })
    }

    // Validate we have meaningful data
    if (creatorData.followerCount === 0) {
      return res.status(404).json({
        success: false,
        error: `No follower data found for @${cleanCreator} in LunarCrush database`,
      })
    }

    console.log(`✅ LLM extracted data for @${creatorData.handle}: ${creatorData.followerCount.toLocaleString()} followers, ${creatorData.engagements.toLocaleString()} engagements`)

    // Return standardized creator data
    res.status(200).json({
      success: true,
      data: {
        handle: creatorData.handle,
        followerCount: creatorData.followerCount,
        followers: creatorData.followerCount,
        engagements: creatorData.engagements,
        influenceScore: null,
        engagement: null,
        verified: creatorData.verified,
        platform: creatorData.platform,
        source: 'LLM-Parsed MCP Analysis'
      },
      metadata: {
        source: 'LunarCrush MCP via LLM Parsing',
        toolsUsed: toolCalls.map(t => t.tool),
        requestTime: new Date().toISOString(),
        parsingMethod: 'Gemini-2.0-flash-exp'
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
