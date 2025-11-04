const { generateMockGTMStrategy } = require('../utils/mockAI');

async function gtmStrategyAgent(openai, context) {
  // Check if OpenAI is configured
  const hasOpenAI = openai && process.env.OPENAI_API_KEY;
  
  if (!hasOpenAI) {
    console.log('Using mock AI for GTM strategy (OpenAI not configured)');
    return generateMockGTMStrategy(context);
  }
  
  const prompt = `Create a go-to-market strategy for:

Product: ${context.productDescription}
Target Market: ${context.targetAudience}
Budget: ${context.marketingBudget}
Timeline: ${context.launchTimeline}

Provide response in JSON format:
{
  "channels": [
    {
      "name": "Channel name",
      "priority": 1,
      "tactics": ["Tactic 1", "Tactic 2"],
      "budgetAllocation": "X%",
      "expectedResults": "What to expect"
    }
  ],
  "contentStrategy": {
    "themes": ["Theme 1", "Theme 2"],
    "formats": ["Format 1", "Format 2"]
  },
  "keyMetrics": ["Metric 1", "Metric 2", "Metric 3"],
  "first90Days": {
    "days1-30": "Action plan for days 1-30",
    "days31-60": "Action plan for days 31-60",
    "days61-90": "Action plan for days 61-90"
  }
}

Return ONLY valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a go-to-market strategy expert. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('GTM Strategy agent error:', error);
    console.log('Falling back to mock AI');
    return generateMockGTMStrategy(context);
  }
}

module.exports = { gtmStrategyAgent };

