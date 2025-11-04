const { generateMockMVPGuidance } = require('../utils/mockAI');

async function mvpGuidanceAgent(openai, context) {
  // Check if OpenAI is configured
  const hasOpenAI = openai && process.env.OPENAI_API_KEY;
  
  if (!hasOpenAI) {
    console.log('Using mock AI for MVP guidance (OpenAI not configured)');
    return generateMockMVPGuidance(context);
  }
  
  const prompt = `You are a technical product advisor. Help prioritize MVP features.

Startup Context:
- Problem: ${context.problemStatement || 'Not specified'}
- Target Users: ${context.targetAudience || 'Not specified'}
- Timeline: ${context.timeline || '8-12 weeks'}
- Proposed Features: ${JSON.stringify(context.proposedFeatures || [])}

Provide response in JSON format:
{
  "mustHaveFeatures": [
    {"feature": "Feature name", "priority": 1, "rationale": "Why it's essential"}
  ],
  "niceToHaveFeatures": [
    {"feature": "Feature name", "rationale": "Why it can wait"}
  ],
  "techStack": [
    {"technology": "Tech name", "rationale": "Why it's recommended"}
  ],
  "timeline": {
    "weeks1-4": "Tasks for weeks 1-4",
    "weeks5-8": "Tasks for weeks 5-8",
    "weeks9-12": "Tasks for weeks 9-12"
  },
  "technicalRisks": [
    {"risk": "Risk description", "mitigation": "How to mitigate"}
  ]
}

Return ONLY valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a technical product advisor. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('MVP Guidance agent error:', error);
    console.log('Falling back to mock AI');
    return generateMockMVPGuidance(context);
  }
}

module.exports = { mvpGuidanceAgent };

