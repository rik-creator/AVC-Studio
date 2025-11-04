const { generateMockAISuite } = require('../utils/mockAI');

async function aiSuiteAgent(openai, context) {
  // Check if OpenAI is configured
  const hasOpenAI = openai && process.env.OPENAI_API_KEY;
  
  if (!hasOpenAI) {
    console.log('Using mock AI for tool recommendations (OpenAI not configured)');
    return generateMockAISuite(context);
  }
  
  const prompt = `Based on this startup profile:

Industry: ${context.industry}
Problem: ${context.problemStatement}
Target Users: ${context.targetAudience}
MVP Features: ${JSON.stringify(context.features || [])}

Recommend specific AI tools and services for:
1. Development automation
2. Customer analytics
3. Marketing automation
4. Operations optimization

Provide response in JSON format:
{
  "tools": [
    {
      "category": "Development",
      "name": "Tool Name",
      "provider": "Provider Name",
      "useCase": "Specific use case for this startup",
      "integrationComplexity": "Low/Medium/High",
      "estimatedCost": "$X/month",
      "expectedROI": "Expected return on investment"
    }
  ],
  "summary": "Overall recommendation summary"
}

Return ONLY valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are an AI tools consultant. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('AI Suite agent error:', error);
    console.log('Falling back to mock AI');
    return generateMockAISuite(context);
  }
}

module.exports = { aiSuiteAgent };

