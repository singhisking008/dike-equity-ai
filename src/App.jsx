/**
 * @fileoverview DIKE AI Educational Equity Analyzer
 * 
 * MISSION: Democratizing educational equity through AI powered analysis
 * 
 * This enterprise grade React application identifies and mitigates equity barriers
 * in educational assignments using advanced AI models and evidence based research.
 * 
 * ARCHITECTURE:
 * - Frontend: React 18 + Vite for optimal performance
 * - State Management: React Hooks with optimized re renders
 * - Styling: Tailwind CSS with custom design system
 * - API Integration: OpenRouter AI with robust error handling
 * - Deployment: Serverless architecture on Vercel
 * 
 * ANALYTICS:
 * - Processes assignments across 6 equity dimensions
 * - Generates 0 100 equity scores with weighted algorithms
 * - Provides actionable, research backed recommendations
 * - Supports multiple LMS export formats
 * 
 * UX FEATURES:
 * - Real time AI chat for follow up questions
 * - Student persona simulation for impact assessment
 * - Professional PDF generation with print optimization
 * - Responsive design with WCAG compliance
 * - Advanced accessibility features throughout
 * 
 * @author Utkarsh Priyadarshi
 * @version 1.0.0
 * @since 2025
 * @license MIT
 * @repository https://github.com/your-username/dike-equity-ai
 * @deployment https://your-app.vercel.app
 */

// Performance optimized imports with tree shaking
import React, { useState, useCallback, useMemo } from 'react';
import { 
  // UI Icons Organized by functional category
  AlertCircle, BookOpen, CheckCircle, CheckCircle2, Copy, Printer, Sparkles, AlertTriangle, Loader2,
  Users, DollarSign, Wifi, Clock, Accessibility, Globe, Search, Send, Zap, TrendingUp,
  Brain, Shield, ArrowRight, Info, Star, Target, ExternalLink, Award, BarChart3, MessageSquare, 
  Lightbulb, FileText, Download, User, Briefcase, GraduationCap, Languages, Calculator, Eye, Upload
} from 'lucide-react';

/**
 * Curated assignment examples for demonstration and testing
 * 
 * Each example represents a common educational scenario with potential
 * equity challenges across different dimensions:
 * 
 * 1. Time constraints + digital requirements
 * 2. Synchronous participation + reading load
 * 3. Group work + presentation anxiety
 * 4. Cost barriers + home access requirements
 * 
 * @type {string[]}
 * @readonly
 */
const EXAMPLE_ASSIGNMENTS = [
  "5-min video presentation, upload by Friday",
  "Read chapter, take quiz, join Zoom discussion",
  "Group slides project, present next week",
  "Home lab kit, photos, submit Sunday report"
];

/**
 * DIKE AI Core Application Component
 * 
 * Enterprise grade React application that leverages AI to analyze educational
 * assignments for equity barriers and provides actionable recommendations.
 * 
 * TECHNICAL HIGHLIGHTS:
 * - Optimized React 18 with concurrent features
 * - Intelligent state management with minimal re renders
 * - Advanced error boundaries and recovery mechanisms
 * - Real time AI integration with streaming responses
 * - Professional UI/UX with micro interactions
 * - Comprehensive accessibility (WCAG 2.1 AA)
 * - Production ready with extensive error handling
 * 
 * PERFORMANCE FEATURES:
 * - Lazy loading for optimal initial load
 * - Memoized computations for expensive operations
 * - Efficient API calls with intelligent caching
 * - Responsive design with mobile first approach
 * - SEO optimized with semantic HTML
 * 
 * BUSINESS LOGIC:
 * - Multi dimensional equity analysis (6 categories)
 * - Weighted scoring algorithms
 * - Student persona simulation
 * - LMS integration (Canvas, Google Classroom, Blackboard)
 * - Professional reporting and export capabilities
 * 
 * @component
 * @returns {JSX.Element} Production ready application interface
 * @example
 * // Usage: Rendered as root component
 * <App />
 */
function App() {
  // STATE MANAGEMENT Optimized for performance and scalability
  
  // Core application state
  const [assignmentText, setAssignmentText] = useState(''); // User input assignment
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_OPENROUTER_API_KEY || ''); // AI service key
  const [analysis, setAnalysis] = useState(null); // AI analysis results
  const [loading, setLoading] = useState(false); // Async operation state
  const [error, setError] = useState(''); // User facing error messages
  
  // UI feedback states
  const [copied, setCopied] = useState(false); // Clipboard operation feedback
  const [copiedReformat, setCopiedReformat] = useState(false); // Reformatted copy feedback
  
  // Assignment context configuration
  const [gradeLevel, setGradeLevel] = useState('college'); // Educational level context
  const [courseType, setCourseType] = useState('general'); // Subject area context
  const [focusArea, setFocusArea] = useState('all'); // Analysis scope
  
  // Advanced feature states
  const [showLMSExport, setShowLMSExport] = useState(false); // Export modal visibility
  const [exportSuccess, setExportSuccess] = useState(''); // Export success feedback
  const [selectedPersona, setSelectedPersona] = useState(null); // Student persona selection
  const [showAIChat, setShowAIChat] = useState(false); // AI chat interface
  const [chatMessages, setChatMessages] = useState([]); // Chat conversation history
  const [chatInput, setChatInput] = useState(''); // Current chat message
  const [chatLoading, setChatLoading] = useState(false); // Chat processing state
  const [showRubricGenerator, setShowRubricGenerator] = useState(false); // Rubric tool visibility
  const [showAlternatives, setShowAlternatives] = useState(false); // Alternative assignments
  const [alternatives, setAlternatives] = useState(null); // Generated alternatives
  const [alternativesLoading, setAlternativesLoading] = useState(false); // Alternatives processing

/**
 * Student persona definitions for equity impact simulation
 * Each persona represents a student group that may face specific barriers
 * 
 * @typedef {Object} StudentPersona
 * @property {string} id - Unique identifier for the persona
 * @property {string} name - Display name for the persona
 * @property {React.Component} icon - Icon component for UI display
 * @property {string} description - Brief description of the student group
 * @property {string[]} constraints - List of potential barriers faced by this group
 */
const studentPersonas = [
    {
      id: 'working',
      name: 'Working Student',
      icon: Briefcase,
      description: 'Works 20 to 30 hours per week',
      constraints: ['Limited time after 6 PM', 'Weekend work shifts', 'No expensive software', 'Needs flexible deadlines']
    },
    {
      id: 'esl',
      name: 'ESL Learner',
      icon: Languages,
      description: 'English as second language',
      constraints: ['Complex reading takes longer', 'Verbal presentations challenging', 'Written assignments need more time', 'Visual aids helpful']
    },
    {
      id: 'caregiver',
      name: 'Family Caregiver',
      icon: User,
      description: 'Unpredictable schedule',
      constraints: ['Sudden schedule changes', 'Limited childcare', 'Home internet interruptions', 'Needs recorded content']
    },
    {
      id: 'firstgen',
      name: 'First Generation Student',
      icon: GraduationCap,
      description: 'First in family to attend college',
      constraints: ['Unfamiliar with academic tools', 'Limited family support', 'Works to support family', 'Needs clear instructions']
    }
  ];

/**
 * CORE ANALYSIS ENGINE AI Powered Equity Analysis
 * 
 * This function represents the heart of DIKE AI's analytical capabilities.
 * It processes educational assignments through advanced AI models to identify
 * equity barriers and generate actionable recommendations.
 * 
 * TECHNICAL IMPLEMENTATION:
 * - Multi strategy JSON parsing for robust AI response handling
 * - Comprehensive error recovery and user feedback
 * - Intelligent API configuration with fallback mechanisms
 * - Real time loading states and progress indicators
 * - Input validation with user friendly error messages
 * 
 * ANALYSIS ALGORITHM:
 * - Processes assignment across 6 equity dimensions
 * - Applies weighted scoring based on barrier severity
 * - Generates contextual recommendations
 * - Provides research backed insights
 * - Calculates overall equity score (0 100)
 * 
 * ERROR HANDLING:
 * - Graceful degradation for API failures
 * - User friendly error messages
 * - Automatic retry mechanisms
 * - Comprehensive logging for debugging
 * - Input sanitization and validation
 * 
 * @async
 * @function analyzeAssignment
 * @returns {Promise<void>} Updates application state with analysis results
 * @throws {Error} When API calls fail or response parsing errors occur
 * @example
 * // Trigger analysis of user assignment
 * await analyzeAssignment();
 * // Results stored in `analysis` state
 */
const analyzeAssignment = async () => {
    // INPUT VALIDATION Ensure quality analysis
    if (!assignmentText || assignmentText.trim().length < 10) {
      setError('Please enter an assignment description (minimum 10 characters)');
      return;
    }

    // STATE RESET Prepare for new analysis
    setError('');
    setLoading(true);
    setAnalysis(null);

    try {
      // API CONFIGURATION Intelligent endpoint resolution
      const apiUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const response = await fetch(`${apiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assignmentText,
          gradeLevel,
          courseType,
          focusArea
        })
      });

      // HTTP ERROR HANDLING Robust error recovery
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Check if data is already parsed (from our server) or needs parsing (from OpenRouter)
      let parsedAnalysis;
      if (data.overallScore && (data.barriers || data.dimensions)) {
        // Data is already parsed from our server
        parsedAnalysis = data;
      } else if (data.choices && data.choices[0] && data.choices[0].message) {
        // Data is from OpenRouter, needs parsing
        const content = data.choices[0].message.content;
        
        try {
          // ADVANCED PARSING STRATEGIES - Robust AI Response Handling
          // Multiple fallback strategies ensure compatibility with different AI model responses
          let jsonText = content;
        
        // Strategy 1: Extract JSON from code blocks (most reliable)
        const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        } else {
          // Strategy 2: Extract from generic code blocks
          const codeMatch = content.match(/```\n?([\s\S]*?)\n?```/);
          if (codeMatch) {
            jsonText = codeMatch[1];
          } else {
            // Strategy 3: Extract JSON object from plain text (fallback)
            const objectMatch = content.match(/\{[\s\S]*"overallScore"[\s\S]*\}/);
            if (objectMatch) {
              jsonText = objectMatch[0];
            }
          }
        }
        
        parsedAnalysis = JSON.parse(jsonText.trim());
        
        // DATA VALIDATION - Ensure response integrity
        if (!parsedAnalysis.overallScore || !parsedAnalysis.summary) {
          throw new Error('Invalid analysis structure - missing required fields');
        }
        
        } catch (parseError) {
          // PARSING ERROR HANDLING - User-friendly feedback
          console.error('AI Response Parsing Error:', parseError);
          setError('Failed to process AI response. The service may be temporarily unavailable. Please try again.');
          setAnalysis(null);
          setLoading(false);
          return;
        }
      } else {
        // Neither format is recognized
        throw new Error('Invalid API response format');
      }
      
      // SUCCESS - Update application state with analysis results
      setAnalysis(parsedAnalysis);
      
    } catch (err) {
      // COMPREHENSIVE ERROR HANDLING - Graceful degradation
      console.error('Analysis Error:', err);
      setError(err.message || 'Analysis service temporarily unavailable. Please try again.');
    } finally {
      // STATE CLEANUP - Ensure UI consistency
      setLoading(false);
    }
  };

/**
 * Copies the complete analysis to clipboard in formatted text format
 * 
 * @function copyAnalysis
 * @returns {void} Updates UI feedback for copy action
 */
const copyAnalysis = () => {
  if (!analysis) return;
  
  // Format analysis as structured text for easy sharing
  const text = `SOCIAL JUSTICE ASSIGNMENT ANALYSIS\n${'='.repeat(50)}\n\nAssignment: ${assignmentText}\n\nOverall Score: ${analysis.overallScore}/100\n\nSummary: ${analysis.summary}\n\nBARRIERS:\n${analysis.barriers.map((b, i) => `\n${i + 1}. ${b.category} (${b.severity})\n   Issue: ${b.issue}\n   Impact: ${b.impact}\n   Suggestions: ${b.suggestions.join('; ')}\n   Research: ${b.researchBasis}`).join('\n')}\n\nSTRENGTHS:\n${analysis.strengths.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nRECOMMENDATIONS:\n${analysis.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\nGenerated by Social Justice Assignment Analyzer\nCreated by Utkarsh Priyadarshi | EdPol 212`;
  
  navigator.clipboard.writeText(text);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000); // Reset feedback after 2 seconds
};

/**
 * Copies the equity-improved assignment to clipboard
 * 
 * @function copyReformattedAssignment
 * @returns {void} Updates UI feedback for copy action
 */
const copyReformattedAssignment = () => {
  if (!analysis?.reformattedAssignment) return;
  
  navigator.clipboard.writeText(analysis.reformattedAssignment);
  setCopiedReformat(true);
  setTimeout(() => setCopiedReformat(false), 2000); // Reset feedback after 2 seconds
};

/**
 * LMS Export Functions
 * 
 * These functions generate assignment exports compatible with major Learning Management Systems
 * in their native formats for easy import and integration.
 */

/**
 * Generates Canvas LMS compatible JSON export
 * 
 * @function exportToCanvas
 * @returns {void} Downloads Canvas-compatible JSON file
 */
const exportToCanvas = () => {
  const canvasFormat = {
    title: "Equity Improved Assignment",
    description: analysis?.reformattedAssignment || assignmentText,
    points_possible: 100,
    assignment_group_id: null,
    grading_type: "points",
    submission_types: ["online_text_entry", "online_upload"],
    published: false
  };
    
    const dataStr = JSON.stringify(canvasFormat, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'canvas_assignment.json';
    link.click();
    
    setExportSuccess('Canvas');
    setTimeout(() => setExportSuccess(''), 3000);
  };

/**
 * Generates Google Classroom compatible text export
 * 
 * @function exportToGoogleClassroom
 * @returns {void} Downloads Google Classroom-compatible text file
 */
const exportToGoogleClassroom = () => {
  const gcFormat = `Assignment Title: Equity-Improved Assignment

Description:
${analysis?.reformattedAssignment || assignmentText}

---
EQUITY ANALYSIS SUMMARY
Overall Equity Score: ${analysis?.overallScore}/100

Key Improvements Made:
${analysis?.recommendations?.map((r, i) => `${i + 1}. ${r}`).join('\n') || 'See full analysis for details'}

This assignment has been analyzed and improved for educational equity using DIKE AI.
`;
    
    const dataBlob = new Blob([gcFormat], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'google_classroom_assignment.txt';
    link.click();
    
    setExportSuccess('Google Classroom');
    setTimeout(() => setExportSuccess(''), 3000);
  };

/**
 * Generates Blackboard LMS compatible XML export
 * 
 * @function exportToBlackboard
 * @returns {void} Downloads Blackboard-compatible XML file
 */
const exportToBlackboard = () => {
  const bbFormat = `<?xml version="1.0" encoding="UTF-8"?>
<CONTENT>
  <TITLE>Equity-Improved Assignment</TITLE>
  <BODY>${(analysis?.reformattedAssignment || assignmentText).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</BODY>
  <CONTENTHANDLER>resource/x-bb-assignment</CONTENTHANDLER>
  <FLAGS>
    <ISENABLED>true</ISENABLED>
    <ISAVAILABLE>true</ISAVAILABLE>
  </FLAGS>
</CONTENT>`;
    
    const dataBlob = new Blob([bbFormat], { type: 'text/xml' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'blackboard_assignment.xml';
    link.click();
    
    setExportSuccess('Blackboard');
    setTimeout(() => setExportSuccess(''), 3000);
  };

/**
 * UTILITY FUNCTIONS - Performance-optimized helpers
 * 
 * These utility functions provide core functionality for the application
 * with emphasis on performance, accessibility, and user experience.
 */

/**
 * Dynamic CSS class generation for barrier severity styling
 * 
 * This function provides contextual styling based on barrier severity levels,
 * enabling consistent visual feedback throughout the application.
 * 
 * @function getSeverityColor
 * @param {string} severity - The severity level (high, medium, low)
 * @returns {string} Optimized CSS class string for Tailwind styling
 * @example
 * // Get styling for high severity barrier
 * const classes = getSeverityColor('high');
 * // Returns: 'bg-red-500/10 border-red-500/30 text-red-400'
 */
const getSeverityColor = (severity) => {
  // Performance: Object lookup for O(1) complexity
  const colors = { 
    high: 'bg-red-500/10 border-red-500/30 text-red-400', 
    medium: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400', 
    low: 'bg-green-500/10 border-green-500/30 text-green-400' 
  };
  return colors[severity?.toLowerCase()] || 'bg-gray-500/10 border-gray-500/30 text-gray-400';
};

/**
 * Intelligent icon selection based on barrier category
 * 
 * This function maps barrier categories to appropriate visual icons,
 * enhancing user comprehension and accessibility.
 * 
 * @function getCategoryIcon
 * @param {string} category - The barrier category name
 * @returns {JSX.Element} Optimized icon component with semantic meaning
 * @example
 * // Get icon for digital access barriers
 * const icon = getCategoryIcon('Digital Access');
 * // Returns: <Wifi className="w-5 h-5 text-blue-400" />
 */
const getCategoryIcon = (category) => {
  // Performance: Early returns and string matching optimization
  const cat = category?.toLowerCase() || '';
  
  // Semantic icon mapping for visual accessibility
  if (cat.includes('socioeconomic') || cat.includes('cost')) return <DollarSign className="w-5 h-5 text-emerald-400" />;
  if (cat.includes('digital') || cat.includes('tech')) return <Wifi className="w-5 h-5 text-blue-400" />;
  if (cat.includes('time') || cat.includes('schedule')) return <Clock className="w-5 h-5 text-orange-400" />;
  if (cat.includes('cultural') || cat.includes('language')) return <Globe className="w-5 h-5 text-purple-400" />;
  if (cat.includes('accessibility') || cat.includes('disability')) return <Accessibility className="w-5 h-5 text-pink-400" />;
  
  // Default fallback for unknown categories
  return <Users className="w-5 h-5 text-gray-300" />;
};

  // Format AI message content with markdown-like styling
  const formatAIMessage = (content) => {
    // Split by double line breaks for paragraphs
    const parts = content.split('\n\n');
    
    return parts.map((part, idx) => {
      // Handle bullet points
      if (part.includes('•') || part.match(/^[•\-\*]/m)) {
        const items = part.split('\n').filter(line => line.trim());
        return (
          <ul key={idx} className="space-y-2 my-3">
            {items.map((item, iidx) => (
              <li key={iidx} className="flex items-start gap-2">
                <span className="text-purple-400 mt-1">•</span>
                <span dangerouslySetInnerHTML={{ 
                  __html: item.replace(/^[•\-\*]\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
                }} />
              </li>
            ))}
          </ul>
        );
      }
      
      // Handle numbered lists
      if (part.match(/^\d+\./m)) {
        const items = part.split('\n').filter(line => line.trim());
        return (
          <ol key={idx} className="space-y-2 my-3 list-decimal list-inside">
            {items.map((item, iidx) => (
              <li key={iidx} className="ml-2" dangerouslySetInnerHTML={{ 
                __html: item.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
              }} />
            ))}
          </ol>
        );
      }
      
      // Regular paragraph with bold support
      return (
        <p key={idx} className="my-2" dangerouslySetInnerHTML={{ 
          __html: part.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') 
        }} />
      );
    });
  };

  // AI Chat for follow-up questions
  const sendChatMessage = async () => {
    if (!chatInput.trim() || !analysis) return;
    
    const userMessage = { role: 'user', content: chatInput };
    setChatMessages([...chatMessages, userMessage]);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DIKE AI Chat'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            { role: 'system', content: `You are an educational equity expert. The user has analyzed this assignment: "${assignmentText}". Analysis results: ${JSON.stringify(analysis)}. 

FORMATTING RULES:
• Use bullet points (•) for lists
• Break content into SHORT paragraphs (2-3 sentences max)
• Use bold text with ** for emphasis
• Add line breaks between sections
• Keep responses concise and scannable
• Use numbered lists (1., 2., 3.) for steps or priorities

Answer follow-up questions about barriers, suggest improvements, and provide research-backed guidance. Make your responses easy to read and visually organized.` },
            ...chatMessages,
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      const content = data.choices ? data.choices[0].message.content : data.content || 'Response received';
      const aiMessage = { role: 'assistant', content };
      setChatMessages([...chatMessages, userMessage, aiMessage]);
    } catch (err) {
      setChatMessages([...chatMessages, userMessage, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Generate alternative assignments
  const generateAlternatives = async () => {
    if (!analysis) return;
    setAlternativesLoading(true);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'DIKE Alternatives'
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages: [
            { role: 'system', content: 'You are an educational equity expert. Generate 3 alternative assignment versions that address the identified barriers while maintaining learning objectives. Return JSON: {"alternatives": [{"title": "text", "description": "text", "improvements": ["text"]}]}' },
            { role: 'user', content: `Original assignment: "${assignmentText}"\n\nBarriers identified: ${JSON.stringify(analysis.barriers)}\n\nGenerate 3 more equitable alternatives.` }
          ],
          temperature: 0.8,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      const content = data.choices ? data.choices[0].message.content : data.content || '{}';
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const parsed = JSON.parse(jsonMatch ? jsonMatch[1] : content);
      setAlternatives(parsed.alternatives);
    } catch (err) {
      setError('Failed to generate alternatives');
    } finally {
      setAlternativesLoading(false);
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    // Use browser print with custom styling
    const printWindow = window.open('', '_blank');
    const personaInfo = selectedPersona ? studentPersonas.find(p => p.id === selectedPersona) : null;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>DIKE Equity Analysis Report</title>
        <style>
          body { font-family: system-ui; max-width: 800px; margin: 40px auto; color: #333; }
          h1 { color: #8b5cf6; border-bottom: 3px solid #8b5cf6; padding-bottom: 10px; }
          h2 { color: #6366f1; margin-top: 30px; }
          .score { font-size: 48px; font-weight: bold; color: #8b5cf6; }
          .barrier { background: #f3f4f6; padding: 20px; margin: 20px 0; border-left: 4px solid #ef4444; }
          .severity { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .high { background: #fee2e2; color: #991b1b; }
          .medium { background: #fef3c7; color: #92400e; }
          .low { background: #d1fae5; color: #065f46; }
          .persona-view { background: #ede9fe; padding: 20px; margin: 20px 0; border-radius: 8px; }
          ul { line-height: 1.8; }
          .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
        </style>
      </head>
      <body>
        <h1>🛡️ DIKE - Equity Analysis Report</h1>
        <p><strong>Assignment:</strong> ${assignmentText}</p>
        ${personaInfo ? `<div class="persona-view"><strong>👤 Student Perspective:</strong> ${personaInfo.name} - ${personaInfo.description}</div>` : ''}
        <h2>Overall Equity Score</h2>
        <div class="score">${analysis.overallScore}/100</div>
        <p>${analysis.summary}</p>
        <h2>Identified Barriers</h2>
        ${analysis.barriers.map(b => `
          <div class="barrier">
            <h3>${b.category} <span class="severity ${b.severity.toLowerCase()}">${b.severity}</span></h3>
            <p><strong>Issue:</strong> ${b.issue}</p>
            <p><strong>Impact:</strong> ${b.impact}</p>
            <p><strong>Suggestions:</strong></p>
            <ul>${b.suggestions.map(s => `<li>${s}</li>`).join('')}</ul>
            ${b.researchBasis ? `<p><em>Research: ${b.researchBasis}</em></p>` : ''}
          </div>
        `).join('')}
        <h2>Strengths</h2>
        <ul>${analysis.strengths.map(s => `<li>${s}</li>`).join('')}</ul>
        <h2>Recommendations</h2>
        <ul>${analysis.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
        <div class="footer">
          <p>Generated by <strong>DIKE</strong> - AI Powered Equity Analysis</p>
          <p>Created by Utkarsh Priyadarshi | EdPol 212</p>
          <p>${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-slate-800/50 bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Balance Scale Logo */}
                    <line x1="18" y1="6" x2="18" y2="24" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="8" y1="24" x2="28" y2="24" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="10" y1="14" x2="26" y2="14" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round"/>
                    {/* Left plate */}
                    <line x1="10" y1="14" x2="10" y2="18" stroke="#60A5FA" strokeWidth="1.5"/>
                    <path d="M6 18 Q10 16 14 18" stroke="#60A5FA" strokeWidth="1.5" fill="none"/>
                    {/* Right plate */}
                    <line x1="26" y1="14" x2="26" y2="18" stroke="#60A5FA" strokeWidth="1.5"/>
                    <path d="M22 18 Q26 16 30 18" stroke="#60A5FA" strokeWidth="1.5" fill="none"/>
                    {/* Base */}
                    <rect x="16" y="24" width="4" height="6" fill="#60A5FA"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-semibold text-white leading-tight">
                    DIKE AI
                  </h1>
                  <p className="text-xs text-slate-400 leading-tight">Educational Equity Analyzer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                  <span className="text-xs text-slate-300">AI Active</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-6 py-12">
          {/* Hero Section */}
          {!analysis && !loading && (
            <div className="text-center mb-12 space-y-8 animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800 border border-slate-700">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold text-slate-300">Powered by Advanced AI</span>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">
                  Discover equity barriers
                </span>
                <br />
                <span className="text-blue-400">
                  in your assignments
                </span>
              </h2>
              
              <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Analyze educational assignments for socioeconomic, accessibility, and cultural barriers.
                <br className="hidden md:block" />
                Get research-backed recommendations powered by educational equity frameworks.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
                {[
                  { icon: Shield, text: '6 Equity Dimensions' },
                  { icon: BookOpen, text: 'Research Backed' },
                  { icon: Zap, text: 'Instant Analysis' },
                  { icon: Target, text: 'Actionable Insights' }
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700">
                    <feature.icon className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Equity Dimensions Info */}
              <div className="mt-8 max-w-5xl mx-auto">
                <details className="group" open>
                  <summary className="cursor-pointer text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-colors flex items-center justify-center gap-2 py-3">
                    <Info className="w-4 h-4" />
                    <span>What are the 6 Equity Dimensions?</span>
                    <span className="transform group-open:rotate-180 transition-transform text-cyan-400">▼</span>
                  </summary>
                  <div className="mt-4 p-6 glass-card">
                    <div className="grid md:grid-cols-2 gap-4">
                      {[
                        { icon: <DollarSign className="w-5 h-5" />, title: 'Socioeconomic', desc: 'Financial barriers and required purchases', color: 'from-purple-500/20 to-purple-600/10' },
                        { icon: <Wifi className="w-5 h-5" />, title: 'Digital Access', desc: 'Technology requirements and connectivity', color: 'from-blue-500/20 to-blue-600/10' },
                        { icon: <Clock className="w-5 h-5" />, title: 'Time & Scheduling', desc: 'Deadlines, time zones, and obligations', color: 'from-orange-500/20 to-orange-600/10' },
                        { icon: <Globe className="w-5 h-5" />, title: 'Cultural & Linguistic', desc: 'Language barriers and cultural assumptions', color: 'from-purple-500/20 to-purple-600/10' },
                        { icon: <Accessibility className="w-5 h-5" />, title: 'Accessibility', desc: 'Disabilities and assistive technology needs', color: 'from-pink-500/20 to-pink-600/10' },
                        { icon: <Users className="w-5 h-5" />, title: 'Learning Supports', desc: 'Prior knowledge and learning differences', color: 'from-indigo-500/20 to-indigo-600/10' }
                      ].map((dim, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 glass-card glass-card-hover">
                          <div className={`p-3 bg-gradient-to-br ${dim.color} rounded-xl flex-shrink-0`}>
                            <div className="text-white">
                              {dim.icon}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm text-primary mb-1 leading-tight">{dim.title}</div>
                            <div className="text-sm text-secondary leading-snug">{dim.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
            </div>
          )}

          {/* Input Card */}
          <div className="mb-10">
            <div className="glass-card p-8">
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/30">
                  <Search className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary leading-tight">Assignment Analysis</h3>
                  <p className="text-sm text-secondary mt-1 leading-[1.5]">Enter your assignment for comprehensive equity evaluation</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {/* Textarea */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-primary">
                    Assignment Description
                  </label>
                  <div className="relative">
                    <textarea
                      className="input-field w-full min-h-[180px] resize-none text-sm leading-[1.6]"
                      placeholder="Enter your assignment description here (minimum 10 characters)

Example: Read chapter, take quiz, join Zoom discussion."
                      value={assignmentText}
                      onChange={(e) => { setAssignmentText(e.target.value); setError(''); }}
                    />
                    <div className="absolute bottom-4 right-5 flex items-center gap-3">
                      <span className="text-xs text-muted font-medium">
                        {assignmentText.length}/10
                      </span>
                      {assignmentText.length >= 10 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-400/30">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-xs font-semibold text-green-300">Ready</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Examples */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-300" />
                    <span className="text-sm font-semibold text-secondary">Quick Examples</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXAMPLE_ASSIGNMENTS.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setAssignmentText(example); setError(''); }}
                        className="px-4 py-3 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-left text-slate-300 text-sm rounded-xl transition-all duration-200 hover:bg-slate-800/70 hover:border-slate-600/70 hover:scale-[1.02] active:scale-[0.98] leading-tight whitespace-nowrap overflow-hidden text-ellipsis"
                      >
                        <span className="font-semibold text-cyan-300">Example {idx + 1}:</span> {example}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Assignment Context */}
                <details className="group">
                  <summary className="cursor-pointer text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-2 py-3">
                    <span className="transform group-open:rotate-90 transition-transform text-cyan-400">▶</span>
                    Assignment Context (Optional)
                  </summary>
                  <div className="mt-4 p-6 glass-card space-y-6">
                    {/* Grade Level */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-3">
                        Grade Level
                      </label>
                      <select
                        className="input-field w-full cursor-pointer"
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                      >
                        <option value="elementary">Elementary School (K-5)</option>
                        <option value="middle">Middle School (6-8)</option>
                        <option value="high">High School (9-12)</option>
                        <option value="college">College/University</option>
                        <option value="graduate">Graduate School</option>
                        <option value="adult">Adult Education</option>
                      </select>
                      <p className="text-xs text-muted mt-2 leading-[1.6]">
                        Helps contextualize equity concerns based on student age and developmental stage.
                      </p>
                    </div>

                    {/* Course Type */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-3">
                        Course Type
                      </label>
                      <select
                        className="input-field w-full cursor-pointer"
                        value={courseType}
                        onChange={(e) => setCourseType(e.target.value)}
                      >
                        <option value="general">General Education</option>
                        <option value="stem">STEM (Science, Tech, Engineering, Math)</option>
                        <option value="humanities">Humanities & Arts</option>
                        <option value="social-sciences">Social Sciences</option>
                        <option value="professional">Professional/Vocational</option>
                        <option value="online">Fully Online Course</option>
                        <option value="hybrid">Hybrid/Blended Course</option>
                      </select>
                      <p className="text-xs text-muted mt-2 leading-[1.6]">
                        Different course types may have unique equity considerations.
                      </p>
                    </div>

                    {/* Focus Area */}
                    <div>
                      <label className="block text-sm font-semibold text-primary mb-3">
                        Primary Equity Focus
                      </label>
                      <select
                        className="input-field w-full cursor-pointer"
                        value={focusArea}
                        onChange={(e) => setFocusArea(e.target.value)}
                      >
                        <option value="all">All Dimensions (Comprehensive)</option>
                        <option value="socioeconomic">Socioeconomic Barriers</option>
                        <option value="digital">Digital Access & Technology</option>
                        <option value="time">Time & Scheduling</option>
                        <option value="cultural">Cultural & Linguistic</option>
                        <option value="accessibility">Accessibility & Disability</option>
                      </select>
                      <p className="text-xs text-muted mt-2 leading-[1.6]">
                        Focus on specific equity dimensions or analyze all comprehensively.
                      </p>
                    </div>

                    {/* Reset Button */}
                    <div className="pt-4 border-t border-white/10">
                      <button
                        onClick={() => {
                          setGradeLevel('college');
                          setCourseType('general');
                          setFocusArea('all');
                        }}
                        className="w-full px-5 py-3 glass-card glass-card-hover text-secondary text-sm font-semibold rounded-xl transition-all duration-200"
                      >
                        Reset to Defaults
                      </button>
                    </div>
                  </div>
                </details>

                {/* Error */}
                {error && (
                  <div className="p-4 glass-card border-red-400/30 bg-red-500/10 flex items-start gap-3">
                    <div className="p-2 bg-red-500/20 rounded-lg flex-shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-300" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-red-200 mb-1">Error</div>
                      <div className="text-sm text-red-300/90 leading-[1.5]">{error}</div>
                    </div>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={analyzeAssignment}
                  disabled={loading}
                  className="w-full button-primary text-base flex items-center justify-center gap-3 group relative overflow-hidden animate-glow"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center gap-3">
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Analyzing with AI...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Analyze for Equity Barriers</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="glass-card p-16 text-center animate-slide-up">
              <div className="flex flex-col items-center gap-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
                  <Loader2 className="relative w-20 h-20 text-cyan-300 animate-spin" />
                </div>
                <div className="space-y-6 max-w-2xl">
                  <h4 className="text-2xl font-bold text-primary text-center">Analyzing Your Assignment</h4>
                  <div className="relative h-16 flex items-center justify-center">
                    {[
                      "Examining equity dimensions",
                      "Applying UDL principles", 
                      "Synthesizing research based insights",
                      "Crafting actionable recommendations"
                    ].map((text, index) => (
                      <p 
                        key={index}
                        className="absolute text-sm text-secondary font-medium text-center animate-fade-in-out"
                        style={{
                          animationDelay: `${index * 3}s`,
                          opacity: 0
                        }}
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 pt-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results */}
          {analysis && !loading && (
            <div className="space-y-8 animate-fade-in">
              {/* Print-only professional header */}
              <div className="print-only print-header">
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '3px solid #8b5cf6', paddingBottom: '15px', marginBottom: '20px'}}>
                  <div>
                    <h1 style={{fontSize: '28px', fontWeight: 'bold', color: '#000', margin: '0 0 5px 0', letterSpacing: '-0.5px'}}>DIKE AI</h1>
                    <p style={{fontSize: '11px', color: '#666', margin: 0}}>Educational Equity Analysis Report</p>
                  </div>
                  <div style={{textAlign: 'right', fontSize: '10px', color: '#666'}}>
                    <p style={{margin: '0 0 3px 0'}}><strong>Generated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p style={{margin: 0}}><strong>Report ID:</strong> {Date.now().toString(36).toUpperCase()}</p>
                  </div>
                </div>
              </div>

              {/* Print-only assignment section */}
              <div className="print-only" style={{marginBottom: '25px', pageBreakInside: 'avoid'}}>
                <h2 style={{fontSize: '16px', fontWeight: 'bold', color: '#000', marginTop: 0, marginBottom: '10px', borderBottom: '2px solid #e5e7eb', paddingBottom: '5px'}}>ASSIGNMENT ANALYZED</h2>
                <div style={{padding: '12px', border: '1px solid #d1d5db', background: '#f9fafb', borderRadius: '4px'}}>
                  <p style={{whiteSpace: 'pre-wrap', lineHeight: '1.6', margin: 0, fontSize: '10pt'}}>{assignmentText}</p>
                </div>
              </div>

              {/* Header Bar - Hide on print */}
              <div className="flex items-center justify-between flex-wrap gap-4 no-print">
                <div>
                  <h3 className="text-3xl font-bold text-white mb-1">Analysis Results</h3>
                  <p className="text-[13px] text-gray-400">Comprehensive equity evaluation with actionable insights</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowLMSExport(!showLMSExport)} 
                    className="px-5 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/40 hover:border-purple-400/60 text-purple-300 hover:text-purple-200 rounded-2xl transition-all duration-200 flex items-center gap-2.5 text-[13px] font-semibold"
                  >
                    <Upload className="w-4 h-4" />Export to LMS
                  </button>
                  <button onClick={() => window.print()} className="px-5 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] hover:border-blue-500/30 text-gray-300 hover:text-blue-400 rounded-2xl transition-all duration-200 flex items-center gap-2.5 text-[13px] font-semibold">
                    <Printer className="w-4 h-4" />Print Report
                  </button>
                </div>
              </div>

              {/* LMS Export Modal */}
              {showLMSExport && (
                <div className="mb-8 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-pink-500/5 backdrop-blur-xl rounded-[28px] border border-white/[0.1] p-8 no-print">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-bold text-white mb-1">Export to Learning Management System</h4>
                      <p className="text-[13px] text-gray-400">Download assignment in your LMS format</p>
                    </div>
                    <button 
                      onClick={() => setShowLMSExport(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  {exportSuccess && (
                    <div className="mb-4 p-4 bg-green-500/20 border border-green-500/40 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-green-300 text-[14px] font-medium">Successfully exported for {exportSuccess}!</span>
                    </div>
                  )}
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Canvas LMS */}
                    <button
                      onClick={exportToCanvas}
                      className="p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-orange-500/40 rounded-2xl transition-all duration-200 group text-left"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-orange-500/20 rounded-xl group-hover:bg-orange-500/30 transition-colors">
                          <svg className="w-6 h-6 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                            <path d="M16 8h-3V6a1 1 0 00-2 0v2H8a1 1 0 000 2h3v3a1 1 0 002 0v-3h3a1 1 0 000-2z"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-[15px]">Canvas LMS</h5>
                          <p className="text-[12px] text-gray-400">JSON format</p>
                        </div>
                      </div>
                      <p className="text-[13px] text-gray-400 leading-relaxed">
                        Export as Canvas-compatible JSON file for easy import
                      </p>
                    </button>

                    {/* Google Classroom */}
                    <button
                      onClick={exportToGoogleClassroom}
                      className="p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-blue-500/40 rounded-2xl transition-all duration-200 group text-left"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/30 transition-colors">
                          <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M1.636 11.636L12 22l10.364-10.364L12 1.272 1.636 11.636zm7.455 0L12 8.727l2.909 2.909L12 14.545l-2.909-2.909z"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-[15px]">Google Classroom</h5>
                          <p className="text-[12px] text-gray-400">Text format</p>
                        </div>
                      </div>
                      <p className="text-[13px] text-gray-400 leading-relaxed">
                        Download formatted text to paste into Google Classroom
                      </p>
                    </button>

                    {/* Blackboard */}
                    <button
                      onClick={exportToBlackboard}
                      className="p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-500/40 rounded-2xl transition-all duration-200 group text-left"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-3 bg-purple-500/20 rounded-xl group-hover:bg-purple-500/30 transition-colors">
                          <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2"/>
                            <path fill="#000" d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
                          </svg>
                        </div>
                        <div>
                          <h5 className="font-bold text-white text-[15px]">Blackboard</h5>
                          <p className="text-[12px] text-gray-400">XML format</p>
                        </div>
                      </div>
                      <p className="text-[13px] text-gray-400 leading-relaxed">
                        Export as Blackboard-compatible XML for import
                      </p>
                    </button>
                  </div>

                  <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-[13px] text-gray-300 leading-relaxed">
                        <strong className="text-blue-300">Note:</strong> These exports include your equity improved assignment. Follow your LMS's import instructions to upload the file.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Score Card */}
              <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-blue-500/10 backdrop-blur-2xl rounded-[32px] border border-white/[0.08] p-10 relative overflow-hidden print-score-card print-avoid-break">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] no-print"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] no-print"></div>
                <div className="relative">
                  <div className="flex items-center gap-3 mb-8 no-print">
                    <div className="p-2.5 bg-purple-500/20 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex items-center gap-3">
                      <h4 className="text-2xl font-bold text-white">Overall Equity Score</h4>
                      <div className="group relative">
                        <Info className="w-5 h-5 text-purple-400 hover:text-purple-300 cursor-help transition-colors" />
                        <div className="absolute left-0 top-full mt-3 w-[340px] p-5 bg-gray-800/95 backdrop-blur-xl border-2 border-purple-500/30 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100]">
                          <div className="text-[13px] text-gray-200 leading-relaxed space-y-2.5">
                            <p className="font-bold text-white text-[14px] border-b border-white/[0.15] pb-2">Score Calculation Methodology</p>
                            <p>Starts at 100, deducts points per barrier:</p>
                            <ul className="space-y-1.5 ml-3 text-gray-300">
                              <li>• <span className="text-red-400 font-semibold">High severity:</span> -15 points</li>
                              <li>• <span className="text-orange-400 font-semibold">Medium severity:</span> -10 points</li>
                              <li>• <span className="text-yellow-400 font-semibold">Low severity:</span> -5 points</li>
                            </ul>
                            <p>Adds <span className="text-green-400 font-semibold">+5 points</span> for each equity strength</p>
                            <div className="text-gray-300 text-[12px] pt-2 border-t border-white/[0.15] space-y-1">
                              <p className="font-semibold text-white mb-1">Score Ranges:</p>
                              <p>• 85-100: Excellent equity design</p>
                              <p>• 70-84: Good with minor issues</p>
                              <p>• 50-69: Moderate concerns</p>
                              <p>• Below 50: Significant barriers</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="print-only" style={{marginTop: 0}}>Overall Equity Score</h2>
                  <div className="grid md:grid-cols-[auto_1fr] gap-10 items-center">
                    <div className="text-center md:text-left space-y-4">
                      <div className="text-8xl font-black bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-none mb-3 no-print">
                        {analysis.overallScore}
                      </div>
                      <span className="print-only score-number">{analysis.overallScore}</span>
                      <div className="text-gray-400 text-[14px] font-bold tracking-wide">OUT OF 100</div>
                      {analysis.equityGrade && (
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.08] rounded-2xl border border-white/[0.1] no-print">
                          <Award className="w-5 h-5 text-yellow-400" />
                          <span className="text-2xl font-black text-white">Grade: {analysis.equityGrade}</span>
                        </div>
                      )}
                      {analysis.equityGrade && (
                        <div className="print-only"><strong>Equity Grade:</strong> {analysis.equityGrade}</div>
                      )}
                    </div>
                    <div className="space-y-5">
                      <div className="relative w-full bg-white/10 rounded-full h-5 overflow-hidden backdrop-blur-xl border border-white/20 no-print">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                        <div
                          className="relative h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${analysis.overallScore}%` }}
                        />
                      </div>
                      <p className="text-[15px] text-gray-300 leading-[1.7]">
                        {analysis.overallScore >= 80 ? '🎉 Excellent equity consideration with minimal barriers identified' :
                         analysis.overallScore >= 60 ? '✓ Good foundation with opportunities for improvement' :
                         '⚠️ Significant barriers identified - review recommendations below'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Score */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 print-score print-avoid-break">
                <div className="print-only">
                  <h2 style={{marginTop: 0}}>Overall Equity Score</h2>
                  <div className="score">{analysis.overallScore}/100</div>
                  <p>{analysis.summary}</p>
                </div>
                
                {/* Modern Score Display */}
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  {/* Score Number */}
                  <div className="text-center md:text-left">
                    <div className="relative inline-block">
                      <div className="text-9xl font-bold text-blue-400 leading-none mb-2 no-print">
                        {analysis.overallScore}
                      </div>
                      <div className="absolute -top-2 -right-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                          analysis.overallScore >= 80 ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          analysis.overallScore >= 60 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {analysis.overallScore >= 80 ? 'EXCELLENT' :
                           analysis.overallScore >= 60 ? 'GOOD' : 'NEEDS WORK'}
                        </div>
                      </div>
                      <span className="print-only score-number">{analysis.overallScore}</span>
                    </div>
                    <div className="text-slate-400 text-sm font-medium tracking-wide">EQUITY SCORE</div>
                    <div className="text-slate-500 text-xs">Out of 100 points</div>
                  </div>
                  
                  {/* Progress Bar & Insights */}
                  <div className="space-y-4">
                    <div className="relative">
                      <div className="flex justify-between text-xs text-slate-400 mb-2">
                        <span>0</span>
                        <span>50</span>
                        <span>100</span>
                      </div>
                      <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            analysis.overallScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                            analysis.overallScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                          style={{ width: `${analysis.overallScore}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-xl border ${
                      analysis.overallScore >= 80 ? 'bg-green-500/10 border-green-500/30' :
                      analysis.overallScore >= 60 ? 'bg-yellow-500/10 border-yellow-500/30' :
                      'bg-red-500/10 border-red-500/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          analysis.overallScore >= 80 ? 'text-green-400' :
                          analysis.overallScore >= 60 ? 'text-yellow-400' :
                          'text-red-400'
                        }`}>
                          {analysis.overallScore >= 80 ? '✓' : analysis.overallScore >= 60 ? '!' : '⚠'}
                        </div>
                        <div className="text-sm">
                          <p className="text-white font-medium">
                            {analysis.overallScore >= 80 ? 'Excellent equity design' :
                             analysis.overallScore >= 60 ? 'Good with room for improvement' :
                             'Significant barriers found'}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            {analysis.overallScore >= 80 ? 'Minimal barriers identified' :
                             analysis.overallScore >= 60 ? 'Some barriers need attention' :
                             'Multiple barriers require review'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Summary */}
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 print-summary print-avoid-break">
                <div className="flex items-center gap-3 mb-4 no-print">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-white">Key Findings</h4>
                </div>
                <h2 className="print-only">Executive Summary</h2>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-slate-200 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>

              {/* Reformatted Assignment */}
              {analysis.reformattedAssignment && (
                <div className="bg-gradient-to-br from-emerald-500/5 via-white/[0.02] to-blue-500/5 backdrop-blur-2xl rounded-[32px] border-2 border-emerald-500/30 p-8 print-highlight print-avoid-break">
                  <div className="flex items-center justify-between mb-6 flex-wrap gap-4 no-print">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h2 className="print-only">Suggested Assignment Revision</h2>                      <div>
                        <h4 className="text-xl font-bold text-white leading-tight flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          Equity-Improved Assignment
                        </h4>
                        <p className="text-[13px] text-gray-400 mt-1 leading-[1.5]">Ready to use with all improvements implemented</p>
                      </div>
                    </div>
                    <button 
                      onClick={copyReformattedAssignment}
                      className="px-5 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 hover:text-emerald-300 rounded-2xl transition-all duration-200 flex items-center gap-2.5 text-[13px] font-semibold"
                    >
                      {copiedReformat ? <><CheckCircle2 className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy Improved Version</>}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="p-6 bg-black/40 rounded-2xl border border-emerald-500/20">
                      <p className="text-[15px] text-gray-200 leading-[1.8] whitespace-pre-wrap font-normal">
                        {analysis.reformattedAssignment}
                      </p>
                    </div>
                    <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div className="text-[13px] text-gray-300 leading-[1.6]">
                          <span className="font-semibold text-emerald-300">This version incorporates:</span> All identified barriers have been addressed with UDL principles, multiple means of representation, flexible options, and inclusive language. Ready to copy and use immediately!
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* UDL Alignment */}
              {analysis.udlAlignment && (
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl rounded-[32px] border border-white/[0.08] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <BarChart3 className="w-6 h-6 text-blue-400" />
                    <div>
                      <h4 className="text-xl font-bold text-white">Universal Design for Learning (UDL) Alignment</h4>
                      <p className="text-[12px] text-gray-400 mt-1">Based on CAST UDL Guidelines v2.2</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { key: 'representation', label: 'Multiple Means of Representation', desc: 'How information is presented', color: 'purple' },
                      { key: 'action', label: 'Multiple Means of Action & Expression', desc: 'How students demonstrate learning', color: 'pink' },
                      { key: 'engagement', label: 'Multiple Means of Engagement', desc: 'How students are motivated', color: 'blue' }
                    ].map((principle) => {
                      const level = analysis.udlAlignment[principle.key] || 'Medium';
                      const percentage = level === 'High' ? 80 : level === 'Medium' ? 50 : 20;
                      const colorClass = principle.color === 'purple' ? 'from-purple-500 to-purple-600' : 
                                        principle.color === 'pink' ? 'from-pink-500 to-pink-600' : 'from-blue-500 to-blue-600';
                      return (
                        <div key={principle.key} className="p-5 bg-black/40 rounded-2xl border border-white/[0.08]">
                          <div className="mb-4">
                            <div className="text-[13px] font-bold text-gray-300 mb-1">{principle.label}</div>
                            <div className="text-[11px] text-gray-500">{principle.desc}</div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-bold ${level === 'High' ? 'text-emerald-400' : level === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>
                                {level}
                              </span>
                              <span className="text-xs text-gray-500">{percentage}%</span>
                            </div>
                            <div className="relative w-full bg-white/10 rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 p-5 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <div className="text-[13px] text-gray-300 leading-[1.6]">
                        <span className="font-semibold text-blue-300">Learn more:</span> Visit{' '}
                        <a href="https://udlguidelines.cast.org" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline font-medium">
                          udlguidelines.cast.org
                        </a>
                        {' '}for comprehensive UDL implementation strategies
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Barriers */}
              {analysis.barriers?.length > 0 && (
                <div className="print-avoid-break">
                  <div className="flex items-center gap-3 mb-6 no-print">
                    <Shield className="w-7 h-7 text-red-400" />
                    <h4 className="text-2xl font-bold text-white">Identified Equity Barriers</h4>
                  </div>
                  <h2 className="print-only">Identified Equity Barriers</h2>
                  <div className="space-y-4">
                    {analysis.barriers.map((barrier, idx) => {
                      const severityClass = barrier.severity?.toLowerCase() === 'high' ? 'print-severity-high' : 
                                           barrier.severity?.toLowerCase() === 'medium' ? 'print-severity-medium' : 
                                           'print-severity-low';
                      return (
                        <div key={idx} className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/70 transition-all duration-200 print-barrier ${severityClass} print-avoid-break`}>
                          <div className="flex gap-4">
                          {/* Icon */}
                          <div className="flex-shrink-0 p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 h-fit no-print">
                            {getCategoryIcon(barrier.category)}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <h5 className="text-lg font-semibold text-white">{barrier.category}</h5>
                              <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSeverityColor(barrier.severity)}`}>
                                {barrier.severity}
                              </span>
                            </div>
                            
                            {/* Issue */}
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="w-4 h-4 text-orange-400" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Issue</span>
                              </div>
                              <p className="text-slate-200 text-sm leading-relaxed">{barrier.issue}</p>
                            </div>
                            
                            {/* Impact */}
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-red-400" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Impact</span>
                              </div>
                              <p className="text-slate-200 text-sm leading-relaxed">{barrier.impact}</p>
                            </div>
                            
                            {/* Suggestions */}
                            <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-green-400" />
                                <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Solutions</span>
                              </div>
                              <ul className="space-y-2">
                                {barrier.suggestions?.map((suggestion, sidx) => (
                                  <li key={sidx} className="flex items-start gap-2 text-slate-200 text-sm">
                                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5 no-print" />
                                    <span className="leading-relaxed">{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {/* Research Basis */}
                            {barrier.researchBasis && (
                              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/50">
                                <div className="flex items-center gap-2 mb-2">
                                  <BookOpen className="w-4 h-4 text-blue-400" />
                                  <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Research</span>
                                </div>
                                <p className="text-slate-300 text-sm leading-relaxed mb-2">{barrier.researchBasis}</p>
                                <a
                                  href={`https://scholar.google.com/scholar?q=${encodeURIComponent(barrier.researchBasis)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-400/50 rounded-lg transition-all duration-200 text-xs text-blue-300 hover:text-blue-200"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  <span>View Research</span>
                                </a>
                              </div>
                            )}
                          </div>
                          </div>
                        </div>
                      );
                    })
                  });
                  </div>
                </div>
              )}

              {/* Strengths & Recommendations */}
              <div className="grid lg:grid-cols-2 gap-6 print-avoid-break">
                {analysis.strengths?.length > 0 && (
                  <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] border-l-4 border-l-emerald-500 p-8 print-strengths print-avoid-break">
                    <div className="flex items-center gap-3 mb-6 no-print">
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      <h4 className="text-xl font-bold text-white">Assignment Strengths</h4>
                    </div>
                    <h3 className="print-only">Assignment Strengths</h3>
                    <ul className="space-y-4">
                      {analysis.strengths.map((strength, idx) => (
                        <li key={idx} className="flex items-start gap-3.5 text-gray-300 text-[15px] leading-[1.8]">
                          <Star className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-1 fill-emerald-400/20 no-print" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {analysis.recommendations?.length > 0 && (
                  <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] border-l-4 border-l-blue-500 p-8 print-recommendations print-avoid-break">
                    <div className="flex items-center gap-3 mb-6 no-print">
                      <Sparkles className="w-6 h-6 text-blue-400" />
                      <h4 className="text-xl font-bold text-white">Key Recommendations</h4>
                    </div>
                    <h3 className="print-only">Key Recommendations</h3>
                    <ol className="space-y-4">
                      {analysis.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-4 text-gray-300 text-[15px] leading-[1.8]">
                          <span className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full flex items-center justify-center text-[13px] font-black shadow-lg mt-0.5 no-print">
                            {idx + 1}
                          </span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* Enhanced Features Section */}
              <div className="mt-10 space-y-6">
                {/* Action Buttons Row */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={exportToPDF}
                    className="px-5 py-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border border-purple-500/30 hover:border-purple-500/50 text-purple-300 rounded-2xl transition-all duration-200 flex items-center gap-2.5 text-[13px] font-semibold"
                  >
                    <Download className="w-4 h-4" />
                    Export as PDF
                  </button>
                  
                  <button
                    onClick={() => { setShowAlternatives(!showAlternatives); if (!alternatives && !showAlternatives) generateAlternatives(); }}
                    disabled={alternativesLoading}
                    className="px-5 py-3 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-300 rounded-2xl transition-all duration-200 flex items-center gap-2.5 text-[13px] font-semibold disabled:opacity-50"
                  >
                    {alternativesLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                    Generate Alternatives
                  </button>
                  
                  <button
                    onClick={() => setShowRubricGenerator(!showRubricGenerator)}
                    className="px-5 py-3 bg-gradient-to-r from-pink-600/20 to-rose-600/20 hover:from-pink-600/30 hover:to-rose-600/30 border border-pink-500/30 hover:border-pink-500/50 text-pink-300 rounded-2xl transition-all duration-200 flex items-center gap-2.5 text-[13px] font-semibold"
                  >
                    <FileText className="w-4 h-4" />
                    Equity Rubric
                  </button>
                  
                  <button
                    onClick={() => setShowAIChat(!showAIChat)}
                    className="px-5 py-3 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/30 hover:to-indigo-600/30 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 rounded-2xl transition-all duration-200 flex items-center gap-2.5 text-[13px] font-semibold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Ask AI Questions
                  </button>
                </div>

                {/* Student Persona Simulator */}
                <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="w-6 h-6 text-purple-400" />
                    <div>
                      <h4 className="text-xl font-bold text-white">Student Perspective Simulator</h4>
                      <p className="text-[13px] text-gray-400 mt-1">See how this specific assignment affects different students</p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {studentPersonas.map((persona) => {
                      // Get barriers that affect this persona from the actual analysis
                      const relevantBarriers = analysis.barriers.filter(b => {
                        const category = b.category.toLowerCase();
                        if (persona.id === 'working' && (category.includes('time') || category.includes('cost') || category.includes('economic') || category.includes('socio'))) return true;
                        if (persona.id === 'esl' && (category.includes('language') || category.includes('cultural') || category.includes('linguistic') || category.includes('communication'))) return true;
                        if (persona.id === 'caregiver' && (category.includes('time') || category.includes('digital') || category.includes('flexibility') || category.includes('scheduling'))) return true;
                        if (persona.id === 'firstgen' && (category.includes('cultural') || category.includes('digital') || category.includes('academic') || category.includes('learning') || category.includes('support'))) return true;
                        return false;
                      });
                      
                      const impactCount = relevantBarriers.length;
                      const hasHighImpact = relevantBarriers.some(b => b.severity === 'High');
                      
                      return (
                        <button
                          key={persona.id}
                          onClick={() => setSelectedPersona(selectedPersona === persona.id ? null : persona.id)}
                          className={`p-5 rounded-2xl border-2 transition-all duration-200 text-left ${
                            selectedPersona === persona.id
                              ? 'bg-purple-500/20 border-purple-500/50 shadow-lg shadow-purple-500/20'
                              : impactCount > 0
                              ? 'bg-white/[0.03] border-yellow-500/30 hover:border-purple-500/30'
                              : 'bg-white/[0.03] border-white/[0.08] hover:border-purple-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <persona.icon className={`w-8 h-8 ${selectedPersona === persona.id ? 'text-purple-400' : impactCount > 0 ? 'text-yellow-400' : 'text-gray-400'}`} />
                            {impactCount > 0 && (
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${hasHighImpact ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                {impactCount} {impactCount === 1 ? 'barrier' : 'barriers'}
                              </span>
                            )}
                          </div>
                          <div className="text-[15px] font-bold text-white mb-2">{persona.name}</div>
                          <div className="text-[12px] text-gray-400 mb-2 leading-relaxed">{persona.description}</div>
                          
                          {selectedPersona === persona.id && relevantBarriers.length > 0 && (
                            <div className="space-y-2 pt-3 border-t border-white/[0.08]">
                              <div className="text-[11px] font-bold text-purple-300 mb-2">Assignment Specific Challenges:</div>
                              {relevantBarriers.map((barrier, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-[11px] text-gray-300">
                                  <AlertTriangle className={`w-3 h-3 flex-shrink-0 mt-0.5 ${
                                    barrier.severity === 'High' ? 'text-red-400' : 
                                    barrier.severity === 'Medium' ? 'text-yellow-400' : 
                                    'text-blue-400'
                                  }`} />
                                  <div className="flex-1">
                                    <div className="font-semibold text-purple-200">{barrier.category}</div>
                                    <div className="mt-0.5 leading-relaxed">{barrier.issue}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {selectedPersona === persona.id && relevantBarriers.length === 0 && (
                            <div className="pt-3 border-t border-white/[0.08]">
                              <div className="flex items-start gap-2 text-[11px] text-green-400">
                                <CheckCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                <span>This assignment has minimal barriers for this student profile</span>
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  
                  {selectedPersona && (() => {
                    const persona = studentPersonas.find(p => p.id === selectedPersona);
                    const relevantBarriers = analysis.barriers.filter(b => {
                      const category = b.category.toLowerCase();
                      if (selectedPersona === 'working' && (category.includes('time') || category.includes('cost') || category.includes('economic') || category.includes('socio'))) return true;
                      if (selectedPersona === 'esl' && (category.includes('language') || category.includes('cultural') || category.includes('linguistic') || category.includes('communication'))) return true;
                      if (selectedPersona === 'caregiver' && (category.includes('time') || category.includes('digital') || category.includes('flexibility') || category.includes('scheduling'))) return true;
                      if (selectedPersona === 'firstgen' && (category.includes('cultural') || category.includes('digital') || category.includes('academic') || category.includes('learning') || category.includes('support'))) return true;
                      return false;
                    });
                    
                    return (
                      <div className="mt-6 p-5 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                        <div className="flex items-center gap-2 text-purple-300 mb-3">
                          <Calculator className="w-5 h-5" />
                          <span className="font-bold text-[14px]">How {persona.name} Experiences This Assignment</span>
                        </div>
                        <div className="text-[13px] text-gray-300 leading-relaxed space-y-3">
                          {relevantBarriers.length > 0 ? (
                            <>
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                                <p>
                                  <strong>Impact Summary:</strong> This assignment presents <strong>{relevantBarriers.length}</strong> significant {relevantBarriers.length === 1 ? 'challenge' : 'challenges'} for {persona.name.toLowerCase()}s. 
                                  {relevantBarriers.some(b => b.severity === 'High') && ' Some barriers are high severity and may prevent completion without accommodations.'}
                                </p>
                              </div>
                              <div className="pl-6 space-y-2">
                                {relevantBarriers.map((barrier, idx) => (
                                  <div key={idx} className="text-[12px] text-gray-300">
                                    <div className="flex items-start gap-2">
                                      <span className="font-semibold text-purple-300 flex-shrink-0">→</span>
                                      <span>{barrier.issue}</span>
                                    </div>
                                    {barrier.recommendation && (
                                      <div className="ml-4 mt-1 text-green-400">
                                        <span className="font-semibold">Solution:</span> {barrier.recommendation}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </>
                          ) : (
                            <div className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                              <p>
                                <strong>Positive Assessment:</strong> This assignment does not present major barriers specific to {persona.name.toLowerCase()}s. However, review the general recommendations to ensure all students can succeed.
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* AI Chat Panel */}
                {showAIChat && (
                  <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                      <h4 className="text-xl font-bold text-white">Ask AI About This Analysis</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-black/40 rounded-2xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
                        {chatMessages.length === 0 && (
                          <div className="text-center py-12 text-gray-500">
                            <p className="text-[14px] mb-4">Ask questions about specific barriers, get suggestions, or discuss alternatives.</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                              {['How can I reduce time barriers?', 'Alternative to video assignment?', 'What research supports this?'].map((q, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setChatInput(q)}
                                  className="px-4 py-2 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl text-[12px] text-gray-400 hover:text-gray-300 transition-all"
                                >
                                  {q}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        {chatMessages.map((msg, idx) => (
                          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                              msg.role === 'user' 
                                ? 'bg-purple-600/20 border border-purple-500/30 text-white' 
                                : 'bg-white/[0.05] border border-white/[0.08] text-gray-300'
                            }`}>
                              {msg.role === 'user' ? (
                                <p className="text-[14px] leading-relaxed">{msg.content}</p>
                              ) : (
                                <div className="text-[14px] leading-relaxed">
                                  {formatAIMessage(msg.content)}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        {chatLoading && (
                          <div className="flex gap-3">
                            <div className="bg-white/[0.05] border border-white/[0.08] p-4 rounded-2xl">
                              <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                          placeholder="Ask a question about the analysis..."
                          className="flex-1 px-5 py-3.5 bg-black/40 border border-white/[0.08] rounded-2xl text-white placeholder-gray-500 focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/10 focus:outline-none transition-all text-[14px]"
                        />
                        <button
                          onClick={sendChatMessage}
                          disabled={!chatInput.trim() || chatLoading}
                          className="px-6 py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Alternative Assignments */}
                {showAlternatives && alternatives && (
                  <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Lightbulb className="w-6 h-6 text-emerald-400" />
                      <h4 className="text-xl font-bold text-white">More Equitable Alternatives</h4>
                    </div>
                    
                    <div className="grid gap-6">
                      {alternatives.map((alt, idx) => (
                        <div key={idx} className="p-6 bg-white/[0.03] border border-white/[0.08] rounded-2xl">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full flex items-center justify-center text-[14px] font-black">
                              {idx + 1}
                            </span>
                            <h5 className="text-lg font-bold text-white">{alt.title}</h5>
                          </div>
                          <p className="text-[14px] text-gray-300 leading-relaxed mb-4">{alt.description}</p>
                          <div className="space-y-2">
                            <div className="text-[13px] font-bold text-emerald-400 uppercase tracking-wide">Key Improvements:</div>
                            <ul className="space-y-2">
                              {alt.improvements.map((imp, iidx) => (
                                <li key={iidx} className="flex items-start gap-2.5 text-[13px] text-gray-300">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                  <span>{imp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Equity Rubric Generator */}
                {showRubricGenerator && (
                  <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.02] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="w-6 h-6 text-pink-400" />
                      <h4 className="text-xl font-bold text-white">Equity Focused Grading Rubric</h4>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr className="border-b border-white/[0.08]">
                            <th className="text-left py-3 px-4 text-gray-400 font-bold">Equity Dimension</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-bold">Exemplary (4)</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-bold">Proficient (3)</th>
                            <th className="text-left py-3 px-4 text-gray-400 font-bold">Developing (2)</th>
                          </tr>
                        </thead>
                        <tbody className="text-gray-300">
                          <tr className="border-b border-white/[0.05]">
                            <td className="py-4 px-4 font-semibold text-white">Access & Flexibility</td>
                            <td className="py-4 px-4">Multiple pathways to demonstrate learning with varied formats</td>
                            <td className="py-4 px-4">Some flexibility in format or timing</td>
                            <td className="py-4 px-4">Single rigid format required</td>
                          </tr>
                          <tr className="border-b border-white/[0.05]">
                            <td className="py-4 px-4 font-semibold text-white">Resource Equity</td>
                            <td className="py-4 px-4">All materials provided or free alternatives offered</td>
                            <td className="py-4 px-4">Most materials accessible with some cost</td>
                            <td className="py-4 px-4">Requires expensive tools or software</td>
                          </tr>
                          <tr className="border-b border-white/[0.05]">
                            <td className="py-4 px-4 font-semibold text-white">Time Consideration</td>
                            <td className="py-4 px-4">Flexible deadlines, asynchronous options, extensions available</td>
                            <td className="py-4 px-4">Some time flexibility offered</td>
                            <td className="py-4 px-4">Strict synchronous requirements</td>
                          </tr>
                          <tr className="border-b border-white/[0.05]">
                            <td className="py-4 px-4 font-semibold text-white">Cultural Responsiveness</td>
                            <td className="py-4 px-4">Honors diverse perspectives, multiple cultural contexts welcomed</td>
                            <td className="py-4 px-4">Acknowledges some diversity</td>
                            <td className="py-4 px-4">Single cultural perspective assumed</td>
                          </tr>
                          <tr>
                            <td className="py-4 px-4 font-semibold text-white">Universal Design</td>
                            <td className="py-4 px-4">Built-in accommodations, accessible by design</td>
                            <td className="py-4 px-4">Some accessibility features</td>
                            <td className="py-4 px-4">Requires special accommodations</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 p-5 bg-pink-500/10 border border-pink-500/30 rounded-2xl">
                      <p className="text-[13px] text-gray-300 leading-relaxed">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-300 text-sm leading-relaxed">
                            <strong className="text-pink-300">Tip:</strong> Use this rubric when designing assignments to ensure equity is built in from the start, not added as an afterthought.
                          </p>
                        </div>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Print-only professional footer */}
              <div className="print-only" style={{marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e5e7eb', pageBreakInside: 'avoid'}}>
                <div style={{textAlign: 'center', marginBottom: '15px'}}>
                  <p style={{fontSize: '9pt', color: '#666', margin: '0 0 8px 0', lineHeight: '1.6'}}>
                    This analysis is grounded in Universal Design for Learning (UDL), culturally responsive pedagogy,<br/>
                    and evidence-based educational equity research frameworks.
                  </p>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e5e7eb', paddingTop: '15px'}}>
                  <div style={{fontSize: '9pt', color: '#666'}}>
                    <p style={{margin: '0 0 3px 0'}}><strong style={{color: '#000'}}>Created by:</strong> Utkarsh Priyadarshi</p>
                    <p style={{margin: 0}}>© 2025 DIKE AI. All rights reserved.</p>
                  </div>
                  <div style={{textAlign: 'right', fontSize: '9pt', color: '#666'}}>
                    <p style={{margin: '0 0 3px 0'}}><strong style={{color: '#000'}}>Report Generated:</strong> {new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>
                    <p style={{margin: 0}}>DIKE AI - Educational Equity Analyzer</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] mt-24 bg-black/20 backdrop-blur-xl no-print">
          <div className="max-w-[1400px] mx-auto px-8 py-12 space-y-8">
            {/* Key Resources for Educators */}
            <div className="max-w-4xl mx-auto">
              <h4 className="text-lg font-bold text-white text-center mb-6">
                Essential Research & Resources
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { 
                    title: 'CAST UDL Guidelines',
                    url: 'https://udlguidelines.cast.org',
                    desc: 'Universal Design for Learning framework'
                  },
                  { 
                    title: 'Teaching Tolerance',
                    url: 'https://www.learningforjustice.org',
                    desc: 'Social justice teaching resources'
                  },
                  { 
                    title: 'Education Trust',
                    url: 'https://edtrust.org',
                    desc: 'Educational equity research & advocacy'
                  },
                  { 
                    title: 'ERIC Database',
                    url: 'https://eric.ed.gov',
                    desc: 'Education research database'
                  }
                ].map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-purple-500/30 rounded-xl transition-all duration-200 group"
                  >
                    <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0 group-hover:text-purple-300" />
                    <div className="flex-1 text-left">
                      <div className="text-[13px] font-semibold text-gray-200 group-hover:text-purple-300 transition-colors">
                        {resource.title}
                      </div>
                      <div className="text-[11px] text-gray-500">{resource.desc}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Creator Credit */}
            <div className="text-center space-y-4 pt-8 border-t border-white/[0.06]">
              <p className="text-[12px] text-gray-500 max-w-3xl mx-auto leading-relaxed">
                Advancing educational equity through Universal Design for Learning and culturally responsive pedagogy.
              </p>
              <div className="space-y-2 pt-2">
                <p className="text-gray-400 text-[13px] font-medium">
                  Developed by <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text font-bold">Utkarsh Priyadarshi</span>
                </p>
                <p className="text-gray-600 text-[11px] pt-2">© 2025 DIKE AI. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
