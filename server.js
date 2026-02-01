import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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
    const { assignmentText, courseType, studentProfile } = req.body;
    console.log('Request body:', { assignmentText: assignmentText?.substring(0, 100), courseType, studentProfile });

    // Validate required fields
    if (!assignmentText || !courseType) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Missing required fields: assignmentText, courseType' });
    }

    // Get API key from environment
    const apiKey = process.env.OPENROUTER_API_KEY || process.env.VITE_OPENROUTER_API_KEY;
    console.log('API key exists:', !!apiKey);
    console.log('API key length:', apiKey?.length || 0);
    
    if (!apiKey) {
      console.log('No API key found');
      return res.status(500).json({ error: 'API key not configured' });
    }

    console.log('Making OpenRouter API call...');
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

    console.log('OpenRouter response status:', response.status);
    console.log('OpenRouter response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.log('OpenRouter error response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter success, got data');
    
    // Extract the AI response content
    const aiResponse = data.choices[0].message.content;
    console.log('AI response length:', aiResponse?.length || 0);
    
    // Try to extract JSON from the response
    let jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/```\n?([\s\S]*?)\n?```/);
    let analysisData;
    
    if (jsonMatch) {
      try {
        analysisData = JSON.parse(jsonMatch[1]);
        console.log('Successfully parsed JSON from AI response');
      } catch (e) {
        console.log('JSON parsing failed, using fallback structure');
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
      console.log('No JSON found in AI response, using fallback structure');
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
    
    console.log('Sending response to client');
    res.json(analysisData);

  } catch (error) {
    console.error('Function error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Internal server error', details: error.message });
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
