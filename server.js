import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

console.log('Starting server...');

// Middleware
app.use(cors({
  origin: ['https://dike-equity-ai.onrender.com', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// API Routes - inline handlers to avoid import issues
app.post('/api/analyze', async (req, res) => {
  console.log('POST /api/analyze called');
  
  try {
    const { assignmentText, courseType, studentProfile, gradeLevel, focusArea } = req.body;
    console.log('Request body:', { 
      assignmentText: assignmentText?.substring(0, 100), 
      courseType, 
      studentProfile,
      gradeLevel,
      focusArea
    });

    // Validate required fields
    if (!assignmentText) {
      console.log('Missing required field: assignmentText');
      return res.status(400).json({ 
        error: 'Missing required field: assignmentText' 
      });
    }

    // Get API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
    console.log('API key exists:', !!apiKey);

    if (!apiKey) {
      console.log('No API key found');
      return res.status(500).json({ 
        error: 'API key not configured' 
      });
    }

    console.log('Making OpenRouter API call...');

    // Create comprehensive prompt
    const systemPrompt = `You are an expert educational equity analyst. Analyze assignments for barriers across six dimensions:

1. **Socioeconomic**: Costs, required purchases, resource access
2. **Digital Access**: Technology requirements, internet needs, software
3. **Time & Scheduling**: Deadlines, flexibility, workload
4. **Cultural & Linguistic**: Language barriers, cultural assumptions
5. **Accessibility**: Disability accommodations, assistive technology
6. **Learning Supports**: Prior knowledge, scaffolding, guidance

Return ONLY valid JSON in this exact format:
{
  "overallScore": 75,
  "summary": "brief summary here",
  "barriers": [
    {
      "category": "Socioeconomic",
      "severity": "Medium",
      "issue": "specific problem",
      "impact": "who is affected",
      "suggestions": ["fix 1", "fix 2"],
      "researchBasis": "research info"
    }
  ],
  "strengths": ["strength 1", "strength 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "reformattedAssignment": "improved version here"
}`;

    const userPrompt = `Analyze this assignment:

**Grade Level**: ${gradeLevel || 'college'}
**Course Type**: ${courseType || 'general'}

**Assignment**: ${assignmentText}

Return ONLY the JSON, no other text.`;

    const requestBody = {
      model: 'nvidia/nemotron-3-nano-30b-a3b:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    console.log('Request to OpenRouter:', JSON.stringify(requestBody, null, 2).substring(0, 300));

    // Call OpenRouter API
    let response;
    try {
      response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://dike-equity-ai.onrender.com',
          'X-Title': 'DIKE AI Educational Equity Analyzer'
        },
        body: JSON.stringify(requestBody)
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({
        error: 'Failed to connect to AI service',
        details: fetchError.message
      });
    }

    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response ok:', response.ok);

    // Get response text first
    let responseText;
    try {
      responseText = await response.text();
      console.log('Response text length:', responseText?.length);
      console.log('Response text preview:', responseText?.substring(0, 500));
    } catch (textError) {
      console.error('Failed to read response text:', textError);
      return res.status(500).json({
        error: 'Failed to read API response',
        details: textError.message
      });
    }

    if (!response.ok) {
      console.log('OpenRouter error - full response:', responseText);

      // Check if it's a rate limit error
      if (response.status === 429) {
        console.log('Rate limit hit');
        return res.json({
          overallScore: 70,
          summary: 'API rate limit reached. Please wait a moment and try again.',
          barriers: [{
            category: 'General Review',
            severity: 'Medium',
            issue: 'Analysis temporarily unavailable',
            impact: 'Rate limit exceeded',
            suggestions: ['Try again in a few moments'],
            researchBasis: 'N/A'
          }],
          strengths: ['Assignment submitted for review'],
          recommendations: ['Please try again shortly'],
          reformattedAssignment: 'Please try again for improved version'
        });
      }

      return res.status(response.status).json({
        error: 'API request failed',
        status: response.status,
        details: responseText
      });
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Successfully parsed response as JSON');
      console.log('Data keys:', Object.keys(data || {}));
      console.log('Data structure:', JSON.stringify(data, null, 2).substring(0, 800));
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.log('Raw response:', responseText);
      return res.status(500).json({
        error: 'Failed to parse API response',
        details: parseError.message,
        rawResponse: responseText.substring(0, 500)
      });
    }

    // NOW check for choices array - with detailed logging
    console.log('Checking for choices...');
    console.log('data exists:', !!data);
    console.log('data.choices exists:', !!data?.choices);
    console.log('data.choices is array:', Array.isArray(data?.choices));
    console.log('data.choices length:', data?.choices?.length);

    if (!data || !data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid response structure - missing choices array');
      console.log('Full data object:', JSON.stringify(data, null, 2));
      
      return res.status(500).json({
        error: 'Invalid API response structure',
        details: 'Missing choices array',
        receivedKeys: Object.keys(data || {}),
        fullResponse: data
      });
    }

    console.log('Checking first choice...');
    console.log('data.choices[0] exists:', !!data.choices[0]);
    console.log('data.choices[0].message exists:', !!data.choices[0]?.message);
    console.log('data.choices[0].message.content exists:', !!data.choices[0]?.message?.content);

    if (!data.choices[0]?.message?.content) {
      console.error('Invalid message structure');
      console.log('First choice:', JSON.stringify(data.choices[0], null, 2));
      
      return res.status(500).json({
        error: 'Invalid API response structure',
        details: 'Missing message content',
        firstChoice: data.choices[0]
      });
    }

    // Extract the AI response content
    const aiResponse = data.choices[0].message.content;
    console.log('AI response length:', aiResponse?.length || 0);
    console.log('AI response preview:', aiResponse?.substring(0, 300));

    // Try to extract JSON from the response
    let analysisData;
    try {
      // Strategy 1: Look for JSON in code blocks
      let jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/);
      
      if (!jsonMatch) {
        // Strategy 2: Look for any code block
        jsonMatch = aiResponse.match(/```\n?([\s\S]*?)\n?```/);
      }
      
      if (!jsonMatch) {
        // Strategy 3: Look for JSON object directly
        jsonMatch = aiResponse.match(/\{[\s\S]*"overallScore"[\s\S]*\}/);
      }

      let jsonText;
      if (jsonMatch) {
        jsonText = jsonMatch[1] || jsonMatch[0];
        console.log('Found JSON match, length:', jsonText.length);
      } else {
        // Strategy 4: Try the whole response
        jsonText = aiResponse.trim();
        console.log('No JSON match found, trying whole response');
      }

      analysisData = JSON.parse(jsonText);
      console.log('Successfully parsed analysis JSON');

      // Validate required fields
      if (!analysisData.overallScore || !analysisData.summary) {
        throw new Error('Missing required fields in analysis');
      }

    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.log('Failed to parse as JSON, creating fallback...');

      // Create a structured response from the text
      analysisData = {
        overallScore: 70,
        summary: 'Analysis completed. Review the recommendations below.',
        barriers: [{
          category: 'General Review',
          severity: 'Medium',
          issue: 'Automated analysis encountered formatting issue',
          impact: 'Manual review recommended',
          suggestions: [
            'Review assignment for time flexibility',
            'Consider resource requirements',
            'Check accessibility needs'
          ],
          researchBasis: 'Universal Design for Learning principles'
        }],
        strengths: ['Assignment submitted for equity review'],
        recommendations: [
          'Provide multiple means of representation',
          'Offer flexible deadlines',
          'Include free alternatives for required materials'
        ],
        reformattedAssignment: aiResponse.substring(0, 500) + '...'
      };
    }

    console.log('Sending response to client');
    res.json(analysisData);

  } catch (error) {
    console.error('Top-level error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error message:', error.message);
    
    res.status(500).json({
      error: 'Internal server error',
      details: error.message,
      stack: error.stack
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'DIKE AI API'
  });
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing - return index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`API Key exists: ${!!(process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY)}`);
});