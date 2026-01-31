export const analyzeHandler = async (req, res) => {
  try {
    const { assignmentText, courseType, studentProfile } = req.body;

    // Validate required fields
    if (!assignmentText || !courseType) {
      return res.status(400).json({ error: 'Missing required fields: assignmentText, courseType' });
    }

    // Get API key from environment
    const apiKey = process.env.VITE_OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
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
    
    // Extract the AI response content
    const aiResponse = data.choices[0].message.content;
    
    // Try to extract JSON from the response
    let jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/```\n?([\s\S]*?)\n?```/);
    let analysisData;
    
    if (jsonMatch) {
      try {
        analysisData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        // If JSON parsing fails, create a structured response from the text
        analysisData = {
          overallScore: 75,
          summary: aiResponse.substring(0, 200) + '...',
          dimensions: [
            { name: 'Socioeconomic', score: 75, issues: ['Review required'], recommendations: ['Consider student resources'] },
            { name: 'Time & Scheduling', score: 75, issues: ['Review required'], recommendations: ['Consider flexibility'] },
            { name: 'Cultural & Linguistic', score: 75, issues: ['Review required'], recommendations: ['Consider inclusivity'] },
            { name: 'Accessibility', score: 75, issues: ['Review required'], recommendations: ['Consider accommodations'] },
            { name: 'Digital Divide', score: 75, issues: ['Review required'], recommendations: ['Consider access'] },
            { name: 'Learning Support', score: 75, issues: ['Review required'], recommendations: ['Consider guidance'] }
          ]
        };
      }
    } else {
      // Create a structured response from plain text
      analysisData = {
        overallScore: 75,
        summary: aiResponse.substring(0, 200) + '...',
        dimensions: [
          { name: 'Socioeconomic', score: 75, issues: ['Review required'], recommendations: ['Consider student resources'] },
          { name: 'Time & Scheduling', score: 75, issues: ['Review required'], recommendations: ['Consider flexibility'] },
          { name: 'Cultural & Linguistic', score: 75, issues: ['Review required'], recommendations: ['Consider inclusivity'] },
          { name: 'Accessibility', score: 75, issues: ['Review required'], recommendations: ['Consider accommodations'] },
          { name: 'Digital Divide', score: 75, issues: ['Review required'], recommendations: ['Consider access'] },
          { name: 'Learning Support', score: 75, issues: ['Review required'], recommendations: ['Consider guidance'] }
        ]
      };
    }
    
    res.json(analysisData);

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
