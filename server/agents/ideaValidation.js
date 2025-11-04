const { generateMockIdeaValidation } = require('../utils/mockAI');

async function validateIdeaAgent(openai, ideaData) {
  // Check if OpenAI is configured
  const hasOpenAI = openai && process.env.OPENAI_API_KEY;
  
  if (!hasOpenAI) {
    console.log('Using mock AI for idea validation (OpenAI not configured)');
    return generateMockIdeaValidation(ideaData);
  }
  
  const prompt = `You are an experienced startup advisor and market analyst. 

A founder has submitted the following startup idea:

Problem Statement: ${ideaData.problemStatement}

Target Audience: ${ideaData.targetAudience}

Unique Value Proposition: ${ideaData.uniqueValue}

Please provide a comprehensive analysis in the following JSON format:
{
  "marketSize": "Detailed market size estimation and growth potential",
  "competitors": [
    {"name": "Competitor 1", "description": "How they differ and compete"},
    {"name": "Competitor 2", "description": "How they differ and compete"},
    {"name": "Competitor 3", "description": "How they differ and compete"},
    {"name": "Competitor 4", "description": "How they differ and compete"},
    {"name": "Competitor 5", "description": "How they differ and compete"}
  ],
  "feasibilityScore": 75,
  "explanation": "Detailed explanation of the feasibility score",
  "risks": ["Risk 1", "Risk 2", "Risk 3"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}

Be encouraging but realistic. Provide actionable insights. Return ONLY valid JSON.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: 'You are a startup validation expert. Always return valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    const validation = JSON.parse(content);

    // Ensure all required fields exist
    return {
      marketSize: validation.marketSize || 'Market analysis pending',
      competitors: validation.competitors || [],
      feasibilityScore: validation.feasibilityScore || 50,
      explanation: validation.explanation || 'Analysis in progress',
      risks: validation.risks || [],
      recommendations: validation.recommendations || []
    };
  } catch (error) {
    console.error('Idea validation agent error:', error);
    console.log('Falling back to mock AI');
    // Fallback to mock if OpenAI fails
    return generateMockIdeaValidation(ideaData);
  }
}

module.exports = { validateIdeaAgent };

