/**
 * Legacy Viral Prediction API - Redirects to main endpoint
 */
export default async function handler(req, res) {
  // Redirect to the main predict-viral-ai endpoint
  if (req.method === 'POST') {
    try {
      // Forward the request to the main endpoint
      const response = await fetch(`${req.headers.origin || 'http://localhost:3000'}/api/predict-viral-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });
      
      const data = await response.json();
      return res.status(response.status).json(data);
      
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Service temporarily unavailable',
        redirect: '/api/predict-viral-ai'
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed. Use POST.' 
  });
}
