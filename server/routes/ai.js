const express = require('express');
const OpenAI = require('openai');
const { pool } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');
const { validateIdeaAgent } = require('../agents/ideaValidation');
const { aiSuiteAgent } = require('../agents/aiSuite');
const { mvpGuidanceAgent } = require('../agents/mvpGuidance');
const { gtmStrategyAgent } = require('../agents/gtmStrategy');
const { metricsAnalysisAgent } = require('../agents/metricsAnalysis');
const { portfolioAnalysisAgent } = require('../agents/portfolioAnalysis');
const { generateMockChatResponse } = require('../utils/mockAI');

const router = express.Router();

// Initialize OpenAI (optional - will use mock if not configured)
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

// All routes require authentication
router.use(authenticateToken);

// Validate idea (Step 2)
router.post('/validate-idea', async (req, res) => {
  try {
    const { problemStatement, targetAudience, uniqueValue } = req.body;

    if (!problemStatement || !targetAudience || !uniqueValue) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validation = await validateIdeaAgent(openai, {
      problemStatement,
      targetAudience,
      uniqueValue
    });

    res.json(validation);
  } catch (error) {
    console.error('Validate idea error:', error);
    res.status(500).json({ error: 'Failed to validate idea', details: error.message });
  }
});

// Analyze market
router.post('/analyze-market', async (req, res) => {
  try {
    const { problemStatement, targetAudience, industry } = req.body;

    if (!openai || !process.env.OPENAI_API_KEY) {
      // Use mock response
      const analysis = `Market Analysis for ${industry || 'General'} Industry:

Market Size and Growth: The market shows significant growth potential, especially in the ${industry || 'technology'} sector. Digital transformation trends are driving adoption.

Key Market Trends:
- Increasing demand for ${problemStatement.toLowerCase().includes('automation') ? 'automation solutions' : 'innovative solutions'}
- Growing ${targetAudience.toLowerCase().includes('business') ? 'B2B' : 'consumer'} adoption
- Shift toward cloud-based and scalable solutions

Target Customer Segments:
- Primary: ${targetAudience}
- Secondary: Adjacent markets with similar needs

Market Entry Barriers:
- Moderate competition from established players
- Need for clear differentiation
- Customer acquisition costs vary by channel

Growth Opportunities:
- Early adopter markets
- Underserved niches
- Strategic partnerships`;

      return res.json({ analysis });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a market research analyst specializing in startup market analysis.'
        },
        {
          role: 'user',
          content: `Analyze the market for this startup idea:

Problem: ${problemStatement}
Target Audience: ${targetAudience}
Industry: ${industry || 'Not specified'}

Provide:
1. Market size and growth potential
2. Key market trends
3. Target customer segments
4. Market entry barriers
5. Growth opportunities`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    const analysis = response.choices[0].message.content;

    res.json({ analysis });
  } catch (error) {
    console.error('Analyze market error:', error);
    res.status(500).json({ error: 'Failed to analyze market', details: error.message });
  }
});

// Recommend AI tools (Step 3)
router.post('/recommend-tools', async (req, res) => {
  try {
    const { industry, problemStatement, targetAudience, features } = req.body;

    const recommendations = await aiSuiteAgent(openai, {
      industry: industry || 'General',
      problemStatement,
      targetAudience,
      features: features || []
    });

    res.json(recommendations);
  } catch (error) {
    console.error('Recommend tools error:', error);
    res.status(500).json({ error: 'Failed to recommend tools', details: error.message });
  }
});

// Generate GTM strategy (Step 6)
router.post('/generate-gtm', async (req, res) => {
  try {
    const { productDescription, targetAudience, marketingBudget, launchTimeline } = req.body;

    const strategy = await gtmStrategyAgent(openai, {
      productDescription,
      targetAudience,
      marketingBudget: marketingBudget || 'Not specified',
      launchTimeline: launchTimeline || '8-12 weeks'
    });

    res.json(strategy);
  } catch (error) {
    console.error('Generate GTM error:', error);
    res.status(500).json({ error: 'Failed to generate GTM strategy', details: error.message });
  }
});

// Analyze metrics (Step 7)
router.post('/analyze-metrics', async (req, res) => {
  try {
    const metrics = req.body;

    const analysis = await metricsAnalysisAgent(openai, metrics);

    res.json(analysis);
  } catch (error) {
    console.error('Analyze metrics error:', error);
    res.status(500).json({ error: 'Failed to analyze metrics', details: error.message });
  }
});

// Generic chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, journeyStep, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Get conversation history
    const convResult = await pool.query(
      `SELECT messages, context FROM ai_conversations 
       WHERE user_id = $1 AND journey_step = $2 
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id, journeyStep || 'general']
    );

    let conversationHistory = [];
    let conversationContext = context || {};

    if (convResult.rows.length > 0) {
      conversationHistory = convResult.rows[0].messages || [];
      conversationContext = { ...conversationContext, ...(convResult.rows[0].context || {}) };
    }

    let assistantMessage;
    
    if (!openai || !process.env.OPENAI_API_KEY) {
      // Use mock chat response
      assistantMessage = generateMockChatResponse(message, journeyStep, conversationHistory);
    } else {
      // Build messages array
      const messages = [
        {
          role: 'system',
          content: 'You are a helpful startup advisor and business consultant. Provide actionable, specific advice.'
        },
        ...conversationHistory.slice(-10), // Last 10 messages for context
        { role: 'user', content: message }
      ];

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-4-turbo-preview',
          messages,
          temperature: 0.7,
          max_tokens: 1000
        });

        assistantMessage = response.choices[0].message.content;
      } catch (error) {
        console.error('Chat OpenAI error:', error);
        console.log('Falling back to mock AI');
        assistantMessage = generateMockChatResponse(message, journeyStep, conversationHistory);
      }
    }

    // Save conversation
    const newMessages = [
      ...conversationHistory,
      { role: 'user', content: message, timestamp: new Date().toISOString() },
      { role: 'assistant', content: assistantMessage, timestamp: new Date().toISOString() }
    ];

    if (convResult.rows.length > 0) {
      await pool.query(
        `UPDATE ai_conversations 
         SET messages = $1, context = $2, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $3 AND journey_step = $4`,
        [JSON.stringify(newMessages), JSON.stringify(conversationContext), req.user.id, journeyStep || 'general']
      );
    } else {
      await pool.query(
        `INSERT INTO ai_conversations (user_id, journey_step, messages, context)
         VALUES ($1, $2, $3, $4)`,
        [req.user.id, journeyStep || 'general', JSON.stringify(newMessages), JSON.stringify(conversationContext)]
      );
    }

    res.json({
      message: assistantMessage,
      conversationHistory: newMessages
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat', details: error.message });
  }
});

module.exports = router;

