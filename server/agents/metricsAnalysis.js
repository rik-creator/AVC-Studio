const { generateMockMetricsAnalysis } = require('../utils/mockAI');

async function metricsAnalysisAgent(openai, metrics) {
  // Check if OpenAI is configured
  const hasOpenAI = openai && process.env.OPENAI_API_KEY;
  
  if (!hasOpenAI) {
    console.log('Using mock AI for metrics analysis (OpenAI not configured)');
    return generateMockMetricsAnalysis(metrics);
  }
  
  const prompt = `Analyze these startup metrics:

User Metrics:
- Total Users: ${metrics.totalUsers || 'N/A'}
- Active Users (30d): ${metrics.activeUsers || 'N/A'}
- Retention Rate: ${metrics.retentionRate || 'N/A'}
- Churn Rate: ${metrics.churnRate || 'N/A'}

Business Metrics:
- Revenue: ${metrics.revenue || 'N/A'}
- CAC: ${metrics.cac || 'N/A'}
- LTV: ${metrics.ltv || 'N/A'}
- Burn Rate: ${metrics.burnRate || 'N/A'}

Provide response in JSON format:
{
  "healthAssessment": "Red/Yellow/Green",
  "pmfScore": 75,
  "strengths": ["Strength 1", "Strength 2"],
  "concerns": ["Concern 1", "Concern 2"],
  "recommendations": [
    {"metric": "Metric name", "recommendation": "How to improve"}
  ],
  "industryBenchmarks": {
    "retentionRate": "Industry average: X%",
    "cac": "Industry average: $X",
    "ltv": "Industry average: $X"
  }
}

Return ONLY valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a startup metrics analyst. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Metrics Analysis agent error:', error);
    console.log('Falling back to mock AI');
    return generateMockMetricsAnalysis(metrics);
  }
}

module.exports = { metricsAnalysisAgent };

