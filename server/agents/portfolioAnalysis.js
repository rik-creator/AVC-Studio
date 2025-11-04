const { generateMockPortfolioAnalysis } = require('../utils/mockAI');

async function portfolioAnalysisAgent(openai, companyData) {
  // Check if OpenAI is configured
  const hasOpenAI = openai && process.env.OPENAI_API_KEY;
  
  if (!hasOpenAI) {
    console.log('Using mock AI for portfolio analysis (OpenAI not configured)');
    return generateMockPortfolioAnalysis(companyData);
  }
  
  const prompt = `As a venture capital analyst, review this portfolio company:

Company: ${companyData.companyName}
Stage: ${companyData.stage}
Metrics: ${JSON.stringify(companyData.metricsData || {})}
Last Review: ${companyData.lastReviewDate || 'N/A'}

Provide response in JSON format:
{
  "healthScore": 75,
  "scoreBreakdown": {
    "traction": 80,
    "team": 70,
    "market": 75,
    "financials": 70
  },
  "highlights": ["Highlight 1", "Highlight 2"],
  "riskFactors": ["Risk 1", "Risk 2"],
  "recommendedActions": ["Action 1", "Action 2"],
  "followOnRecommendation": "Yes/No/Wait",
  "comparison": "Comparison to similar portfolio companies"
}

Return ONLY valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a venture capital analyst. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Portfolio Analysis agent error:', error);
    console.log('Falling back to mock AI');
    return generateMockPortfolioAnalysis(companyData);
  }
}

module.exports = { portfolioAnalysisAgent };

