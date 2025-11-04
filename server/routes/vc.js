const express = require('express');
const { pool } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get VC portfolio
router.get('/portfolio', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM vc_portfolios WHERE vc_user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      // Create portfolio if it doesn't exist
      const insertResult = await pool.query(
        'INSERT INTO vc_portfolios (vc_user_id) VALUES ($1) RETURNING *',
        [req.user.id]
      );
      return res.json({ portfolio: insertResult.rows[0] });
    }

    res.json({ portfolio: result.rows[0] });
  } catch (error) {
    console.error('Get portfolio error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get pipeline
router.get('/pipeline', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT pipeline FROM vc_portfolios WHERE vc_user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({ pipeline: { applicants: [], underReview: [], dueDiligence: [], invested: [] } });
    }

    res.json({ pipeline: result.rows[0].pipeline });
  } catch (error) {
    console.error('Get pipeline error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Move company in pipeline
router.post('/pipeline/move', async (req, res) => {
  try {
    const { companyId, fromStage, toStage } = req.body;

    const result = await pool.query(
      'SELECT pipeline FROM vc_portfolios WHERE vc_user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const pipeline = result.rows[0].pipeline;
    
    // Remove from old stage
    pipeline[fromStage] = pipeline[fromStage].filter(c => c.id !== companyId);
    
    // Add to new stage
    const company = pipeline[fromStage].find(c => c.id === companyId) || 
                   { id: companyId, movedAt: new Date().toISOString() };
    
    if (!pipeline[toStage]) {
      pipeline[toStage] = [];
    }
    pipeline[toStage].push(company);

    await pool.query(
      `UPDATE vc_portfolios 
       SET pipeline = $1, updated_at = CURRENT_TIMESTAMP
       WHERE vc_user_id = $2`,
      [JSON.stringify(pipeline), req.user.id]
    );

    res.json({ message: 'Company moved successfully', pipeline });
  } catch (error) {
    console.error('Move pipeline error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics
router.get('/analytics', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT companies, pipeline FROM vc_portfolios WHERE vc_user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.json({ analytics: generateEmptyAnalytics() });
    }

    const portfolio = result.rows[0];
    const analytics = generateAnalytics(portfolio);

    res.json({ analytics });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get AI insights for a company
router.get('/ai-insights/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const result = await pool.query(
      'SELECT companies FROM vc_portfolios WHERE vc_user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const companies = result.rows[0].companies || [];
    const company = companies.find(c => c.id === companyId);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({ 
      company,
      aiInsights: company.aiInsights || null
    });
  } catch (error) {
    console.error('Get AI insights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function generateAnalytics(portfolio) {
  const companies = portfolio.companies || [];
  const pipeline = portfolio.pipeline || {};

  return {
    totalCompanies: companies.length,
    totalInvested: companies.reduce((sum, c) => sum + (c.investment || 0), 0),
    averageHealthScore: companies.length > 0
      ? companies.reduce((sum, c) => sum + (c.healthScore || 0), 0) / companies.length
      : 0,
    pipelineCounts: {
      applicants: (pipeline.applicants || []).length,
      underReview: (pipeline.underReview || []).length,
      dueDiligence: (pipeline.dueDiligence || []).length,
      invested: (pipeline.invested || []).length
    },
    stageDistribution: getStageDistribution(companies)
  };
}

function generateEmptyAnalytics() {
  return {
    totalCompanies: 0,
    totalInvested: 0,
    averageHealthScore: 0,
    pipelineCounts: { applicants: 0, underReview: 0, dueDiligence: 0, invested: 0 },
    stageDistribution: {}
  };
}

function getStageDistribution(companies) {
  const distribution = {};
  companies.forEach(c => {
    const stage = c.stage || 'unknown';
    distribution[stage] = (distribution[stage] || 0) + 1;
  });
  return distribution;
}

module.exports = router;

