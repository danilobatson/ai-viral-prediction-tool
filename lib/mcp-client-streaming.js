/**
 * HTTP Streaming MCP Client for real-time progress updates
 * Replaces SSE transport with HTTP streaming for better UX
 */

class StreamingMcpClient {
  constructor() {
    this.sessionId = null;
    this.baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.LUNARCRUSH_MCP_URL 
      : 'http://localhost:3000'\;
  }

  async initialize() {
    console.log('🔌 Initializing HTTP Streaming MCP connection...');
    
    try {
      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'initialize',
          params: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
            },
            clientInfo: {
              name: 'viral-prediction-client',
              version: '1.0.0',
            },
          },
          id: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      this.sessionId = response.headers.get('mcp-session-id');
      
      console.log('✅ MCP HTTP streaming connection established:', this.sessionId);
      return result;
      
    } catch (error) {
      console.error('❌ MCP HTTP streaming initialization failed:', error);
      throw error;
    }
  }

  async executeToolWithProgress(toolName, args, onProgress) {
    if (!this.sessionId) {
      throw new Error('MCP client not initialized');
    }

    console.log(`🛠️ Executing tool ${toolName} with streaming progress...`);
    
    try {
      onProgress?.({ step: 'connecting', message: 'Connecting to LunarCrush MCP...' });

      const response = await fetch(`${this.baseUrl}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'mcp-session-id': this.sessionId,
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: args,
          },
          id: Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error(`Tool execution failed: HTTP ${response.status}`);
      }

      onProgress?.({ step: 'fetching', message: 'Fetching creator data from LunarCrush...' });

      // For streaming responses, we can read the response as it comes
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Try to parse complete JSON responses from buffer
        let lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              if (data.result) {
                result = data.result;
                onProgress?.({ step: 'parsing', message: 'LLM parsing creator data...' });
              }
            } catch (parseError) {
              // Continue reading if JSON is incomplete
            }
          }
        }
      }

      // Parse any remaining data in buffer
      if (buffer.trim()) {
        try {
          const data = JSON.parse(buffer);
          if (data.result) {
            result = data.result;
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse final buffer data');
        }
      }

      onProgress?.({ step: 'complete', message: 'Creator data successfully retrieved!' });
      
      console.log(`✅ Tool ${toolName} executed successfully`);
      return result;

    } catch (error) {
      console.error(`❌ Tool ${toolName} execution failed:`, error);
      onProgress?.({ step: 'error', message: `Tool execution failed: ${error.message}` });
      throw error;
    }
  }

  async close() {
    if (this.sessionId) {
      try {
        await fetch(`${this.baseUrl}/mcp`, {
          method: 'DELETE',
          headers: {
            'mcp-session-id': this.sessionId,
          },
        });
        console.log('🔌 MCP HTTP streaming connection closed');
      } catch (error) {
        console.warn('⚠️ Error closing MCP connection:', error.message);
      }
      this.sessionId = null;
    }
  }
}

export async function createStreamingMcpClient() {
  const client = new StreamingMcpClient();
  await client.initialize();
  return client;
}

export async function executeToolCallWithProgress(client, toolName, args, onProgress) {
  return await client.executeToolWithProgress(toolName, args, onProgress);
}
