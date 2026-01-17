const handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const { assignmentText, courseType, studentProfile } = JSON.parse(event.body);

    // Validate required fields
    if (!assignmentText || !courseType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields: assignmentText, courseType' })
      };
    }

    // Get API key from environment
    const apiKey = process.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured' })
      };
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://dike-ai.vercel.app',
        'X-Title': 'DIKE AI Educational Equity Analyzer'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: `You are an expert educational equity analyst analyzing assignments for potential barriers to student success. 
            
            Analyze this assignment across six dimensions of educational equity:
            1. Socioeconomic barriers (costs, resources, technology access)
            2. Time and scheduling constraints (flexibility, deadlines, workload)
            3. Cultural and linguistic inclusivity (representation, language, assumptions)
            4. Accessibility needs (physical, cognitive, technological accommodations)
            5. Digital divide considerations (technology requirements, digital literacy)
            6. Learning support resources (guidance, feedback, scaffolding)
            
            Provide specific, actionable recommendations to improve equity.`
          },
          {
            role: 'user',
            content: `Course Type: ${courseType}
            Student Profile: ${studentProfile || 'Not specified'}
            
            Assignment: ${assignmentText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

module.exports = { handler };
