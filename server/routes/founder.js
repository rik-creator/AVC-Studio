const express = require('express');
const { pool } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get founder journey
router.get('/journey', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM founder_journeys WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journey not found' });
    }

    res.json({ journey: result.rows[0] });
  } catch (error) {
    console.error('Get journey error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific step data
router.get('/journey/step/:stepNumber', async (req, res) => {
  try {
    const stepNumber = parseInt(req.params.stepNumber);
    const result = await pool.query(
      'SELECT step_data, current_step FROM founder_journeys WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journey not found' });
    }

    const stepData = result.rows[0].step_data || {};
    const stepKey = `step${stepNumber}_${getStepName(stepNumber)}`;

    res.json({
      stepNumber,
      data: stepData[stepKey] || null,
      currentStep: result.rows[0].current_step
    });
  } catch (error) {
    console.error('Get step error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update step data
router.put('/journey/step/:stepNumber', async (req, res) => {
  try {
    const stepNumber = parseInt(req.params.stepNumber);
    const stepData = req.body;

    const result = await pool.query(
      'SELECT step_data, current_step FROM founder_journeys WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Journey not found' });
    }

    const currentStepData = result.rows[0].step_data || {};
    const stepKey = `step${stepNumber}_${getStepName(stepNumber)}`;
    
    currentStepData[stepKey] = {
      ...currentStepData[stepKey],
      ...stepData,
      completedAt: new Date().toISOString()
    };

    const newCurrentStep = Math.max(result.rows[0].current_step || 1, stepNumber);

    await pool.query(
      `UPDATE founder_journeys 
       SET step_data = $1, current_step = $2, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3`,
      [JSON.stringify(currentStepData), newCurrentStep, req.user.id]
    );

    res.json({
      message: 'Step updated successfully',
      currentStep: newCurrentStep,
      stepData: currentStepData[stepKey]
    });
  } catch (error) {
    console.error('Update step error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// AI assistance endpoint for a step
router.get('/journey/step/:stepNumber/ai-assist', async (req, res) => {
  try {
    const stepNumber = parseInt(req.params.stepNumber);
    const query = req.query.query;

    // Get conversation history
    const convResult = await pool.query(
      `SELECT * FROM ai_conversations 
       WHERE user_id = $1 AND journey_step = $2 
       ORDER BY created_at DESC LIMIT 1`,
      [req.user.id, `step${stepNumber}`]
    );

    const conversationHistory = convResult.rows.length > 0 
      ? convResult.rows[0].messages 
      : [];

    res.json({
      conversationHistory,
      canChat: true
    });
  } catch (error) {
    console.error('AI assist error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function getStepName(stepNumber) {
  const stepNames = {
    1: 'onboarding',
    2: 'idea',
    3: 'aiSuite',
    4: 'mvp',
    5: 'testing',
    6: 'gtm',
    7: 'pmf',
    8: 'success'
  };
  return stepNames[stepNumber] || 'unknown';
}

module.exports = router;

