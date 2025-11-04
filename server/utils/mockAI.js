// Mock AI responses for when OpenAI API key is not available
// These provide intelligent, structured responses without requiring payment

function generateMockIdeaValidation(ideaData) {
  const { problemStatement, targetAudience, uniqueValue } = ideaData;
  
  // Analyze keywords to determine market size
  const hasTechKeywords = /tech|software|app|platform|digital|ai|ml|automation/i.test(problemStatement);
  const hasB2BKeywords = /business|enterprise|company|organization/i.test(targetAudience);
  const hasB2CKeywords = /consumer|user|individual|people|customer/i.test(targetAudience);
  
  let marketSize = "The market size appears to be ";
  if (hasTechKeywords && hasB2BKeywords) {
    marketSize += "significant, with enterprise software markets typically valued in the billions. B2B tech solutions have strong growth potential.";
  } else if (hasTechKeywords && hasB2CKeywords) {
    marketSize += "substantial, as consumer tech markets continue to expand rapidly. Mobile and digital solutions see high adoption rates.";
  } else {
    marketSize += "moderate to large depending on the specific niche. Traditional markets are evolving with digital transformation.";
  }
  
  // Generate competitors based on keywords
  const competitors = [];
  if (/fintech|payment|banking|finance/i.test(problemStatement)) {
    competitors.push(
      { name: "Stripe", description: "Payment processing leader with extensive API integrations" },
      { name: "Square", description: "Point-of-sale and payment solutions for small businesses" },
      { name: "PayPal", description: "Established payment platform with global reach" }
    );
  }
  if (/ecommerce|retail|shopping|marketplace/i.test(problemStatement)) {
    competitors.push(
      { name: "Amazon", description: "Dominant e-commerce platform with massive infrastructure" },
      { name: "Shopify", description: "E-commerce platform for independent retailers" }
    );
  }
  if (/saas|software|platform|tool/i.test(problemStatement)) {
    competitors.push(
      { name: "Salesforce", description: "Enterprise CRM and cloud platform leader" },
      { name: "Microsoft 365", description: "Productivity suite and business tools" }
    );
  }
  
  // Fill remaining slots with generic competitors
  while (competitors.length < 5) {
    competitors.push({
      name: `Competitor ${competitors.length + 1}`,
      description: "Established player in the market with significant resources"
    });
  }
  
  // Calculate feasibility score based on input quality
  let feasibilityScore = 60; // Base score
  if (problemStatement.length > 50) feasibilityScore += 10;
  if (targetAudience.length > 20) feasibilityScore += 10;
  if (uniqueValue.length > 30) feasibilityScore += 10;
  if (uniqueValue.toLowerCase().includes('unique') || uniqueValue.toLowerCase().includes('only')) feasibilityScore += 5;
  feasibilityScore = Math.min(feasibilityScore, 95);
  
  const explanation = feasibilityScore >= 70 
    ? `Your idea shows strong potential with ${feasibilityScore >= 80 ? 'excellent' : 'good'} clarity on the problem and solution. The market opportunity appears viable.`
    : feasibilityScore >= 50
    ? `Your idea has potential but could benefit from more specific details about the problem, target audience, and unique value proposition.`
    : `Consider refining your idea with more specific details about the problem you're solving and who will benefit.`;
  
  const risks = [
    "Market competition may be intense - differentiation is key",
    "Customer acquisition could be challenging without clear value proposition",
    "Technical execution complexity may impact timeline"
  ];
  
  const recommendations = [
    "Conduct user interviews to validate the problem with your target audience",
    "Research direct and indirect competitors to identify gaps",
    "Create a simple prototype or MVP to test core assumptions",
    "Define clear success metrics for your first 100 customers"
  ];
  
  return {
    marketSize,
    competitors: competitors.slice(0, 5),
    feasibilityScore,
    explanation,
    risks,
    recommendations
  };
}

function generateMockAISuite(context) {
  const { industry, problemStatement, targetAudience } = context;
  
  const tools = [];
  
  // Development tools
  tools.push({
    category: "Development",
    name: "GitHub Copilot",
    provider: "GitHub",
    useCase: "AI-powered code completion and development assistance",
    integrationComplexity: "Low",
    estimatedCost: "$10-20/month",
    expectedROI: "Can reduce development time by 30-40%"
  });
  
  tools.push({
    category: "Development",
    name: "Vercel",
    provider: "Vercel",
    useCase: "Deployment and hosting for web applications",
    integrationComplexity: "Low",
    estimatedCost: "$0-20/month (free tier available)",
    expectedROI: "Faster deployment cycles and improved developer experience"
  });
  
  // Analytics tools
  tools.push({
    category: "Analytics",
    name: "Google Analytics",
    provider: "Google",
    useCase: "User behavior tracking and website analytics",
    integrationComplexity: "Low",
    estimatedCost: "Free",
    expectedROI: "Essential for understanding user engagement and conversion"
  });
  
  tools.push({
    category: "Analytics",
    name: "Mixpanel",
    provider: "Mixpanel",
    useCase: "Product analytics and user journey tracking",
    integrationComplexity: "Medium",
    estimatedCost: "$25-50/month",
    expectedROI: "Better insights into user behavior and feature usage"
  });
  
  // Marketing tools
  tools.push({
    category: "Marketing",
    name: "Mailchimp",
    provider: "Mailchimp",
    useCase: "Email marketing and automation",
    integrationComplexity: "Low",
    estimatedCost: "$0-15/month (free tier available)",
    expectedROI: "Automated email campaigns can increase engagement by 50%+"
  });
  
  tools.push({
    category: "Marketing",
    name: "Buffer",
    provider: "Buffer",
    useCase: "Social media management and scheduling",
    integrationComplexity: "Low",
    estimatedCost: "$0-15/month",
    expectedROI: "Streamlined social media presence saves 5-10 hours/week"
  });
  
  // Operations tools
  tools.push({
    category: "Operations",
    name: "Notion",
    provider: "Notion",
    useCase: "Team collaboration and documentation",
    integrationComplexity: "Low",
    estimatedCost: "$0-8/month (free tier available)",
    expectedROI: "Centralized knowledge base improves team productivity"
  });
  
  return {
    tools,
    summary: `Based on your ${industry || 'startup'} profile, we recommend ${tools.length} essential AI and automation tools. These tools will help you automate development, track user behavior, manage marketing campaigns, and streamline operations. Start with the free-tier options to validate, then scale up as needed.`
  };
}

function generateMockMVPGuidance(context) {
  const { problemStatement, targetAudience, proposedFeatures, timeline } = context;
  
  const mustHaveFeatures = [
    {
      feature: "User Authentication",
      priority: 1,
      rationale: "Essential for user accounts and personalization"
    },
    {
      feature: "Core Value Delivery",
      priority: 2,
      rationale: "The main feature that solves your stated problem"
    },
    {
      feature: "Basic Dashboard",
      priority: 3,
      rationale: "Allows users to see and interact with their data"
    }
  ];
  
  const niceToHaveFeatures = [
    {
      feature: "Advanced Analytics",
      rationale: "Can be added in v2 after validating core features"
    },
    {
      feature: "Social Features",
      rationale: "Nice to have but not essential for MVP validation"
    },
    {
      feature: "Mobile App",
      rationale: "Web version first, then mobile if needed"
    }
  ];
  
  const techStack = [
    {
      technology: "React or Vue.js",
      rationale: "Modern frontend framework for fast development"
    },
    {
      technology: "Node.js + Express",
      rationale: "JavaScript backend for full-stack consistency"
    },
    {
      technology: "PostgreSQL",
      rationale: "Reliable relational database for structured data"
    }
  ];
  
  const weeks = parseInt(timeline) || 10;
  
  return {
    mustHaveFeatures,
    niceToHaveFeatures,
    techStack,
    timeline: {
      "weeks1-4": `Weeks 1-4: Set up development environment, build core infrastructure, implement user authentication, and develop the primary feature that delivers value.`,
      "weeks5-8": `Weeks 5-8: Build dashboard, implement basic UI/UX, add essential integrations, and begin internal testing.`,
      "weeks9-12": `Weeks 9-12: User testing, bug fixes, performance optimization, and prepare for beta launch.`
    },
    technicalRisks: [
      {
        risk: "Scope creep adding unnecessary features",
        mitigation: "Stick strictly to MVP feature list, use feature flags for future additions"
      },
      {
        risk: "Technical debt from rushing",
        mitigation: "Code reviews, basic testing, and refactoring time built into schedule"
      },
      {
        risk: "Third-party API dependencies",
        mitigation: "Have fallback options and mock data for development"
      }
    ]
  };
}

function generateMockGTMStrategy(context) {
  const { productDescription, targetAudience, marketingBudget, launchTimeline } = context;
  
  const channels = [
    {
      name: "Content Marketing",
      priority: 1,
      tactics: [
        "Create blog posts addressing target audience pain points",
        "Develop SEO-optimized content",
        "Publish case studies and success stories"
      ],
      budgetAllocation: "30%",
      expectedResults: "Organic traffic and thought leadership"
    },
    {
      name: "Social Media",
      priority: 2,
      tactics: [
        "LinkedIn for B2B audience",
        "Twitter/X for tech community engagement",
        "Instagram for visual content if applicable"
      ],
      budgetAllocation: "20%",
      expectedResults: "Brand awareness and community building"
    },
    {
      name: "Email Marketing",
      priority: 3,
      tactics: [
        "Welcome email sequences",
        "Newsletter with valuable insights",
        "Product updates and feature announcements"
      ],
      budgetAllocation: "15%",
      expectedResults: "Direct customer communication and retention"
    },
    {
      name: "Paid Advertising",
      priority: 4,
      tactics: [
        "Google Ads for search intent",
        "Facebook/Instagram ads for targeting",
        "Retargeting campaigns"
      ],
      budgetAllocation: "35%",
      expectedResults: "Immediate traffic and conversions"
    }
  ];
  
  return {
    channels,
    contentStrategy: {
      themes: [
        "Problem-solving content",
        "Industry insights and trends",
        "Product tutorials and use cases"
      ],
      formats: ["Blog posts", "Video tutorials", "Infographics", "Webinars"]
    },
    keyMetrics: [
      "Customer Acquisition Cost (CAC)",
      "Lifetime Value (LTV)",
      "Conversion Rate",
      "Monthly Recurring Revenue (MRR)"
    ],
    first90Days: {
      "days1-30": "Launch content marketing campaign, set up analytics tracking, begin social media presence, start building email list",
      "days31-60": "Launch paid advertising campaigns, publish first case studies, engage with community, optimize conversion funnels",
      "days61-90": "Scale successful channels, implement retargeting, expand content types, analyze and optimize based on data"
    }
  };
}

function generateMockMetricsAnalysis(metrics) {
  const {
    totalUsers = 0,
    activeUsers = 0,
    retentionRate = 0,
    churnRate = 0,
    revenue = 0,
    cac = 0,
    ltv = 0
  } = metrics;
  
  // Calculate health assessment
  let healthAssessment = "Green";
  const concerns = [];
  const strengths = [];
  
  if (retentionRate < 30) {
    healthAssessment = "Red";
    concerns.push("Retention rate is below industry average (typically 40-60%)");
  } else if (retentionRate >= 40) {
    strengths.push("Strong retention rate indicates good product-market fit");
  }
  
  if (churnRate > 10) {
    healthAssessment = healthAssessment === "Green" ? "Yellow" : "Red";
    concerns.push("High churn rate suggests users aren't finding value");
  } else if (churnRate < 5) {
    strengths.push("Low churn rate shows strong user satisfaction");
  }
  
  if (cac > 0 && ltv > 0) {
    const ltvCacRatio = ltv / cac;
    if (ltvCacRatio < 3) {
      healthAssessment = healthAssessment === "Green" ? "Yellow" : "Red";
      concerns.push(`LTV/CAC ratio is ${ltvCacRatio.toFixed(1)}x, ideally should be 3x or higher`);
    } else if (ltvCacRatio >= 3) {
      strengths.push(`Excellent LTV/CAC ratio of ${ltvCacRatio.toFixed(1)}x indicates sustainable unit economics`);
    }
  }
  
  if (activeUsers > 0 && totalUsers > 0) {
    const activationRate = (activeUsers / totalUsers) * 100;
    if (activationRate < 20) {
      concerns.push("Low activation rate - users may not be finding core value");
    } else if (activationRate >= 40) {
      strengths.push("Good activation rate shows users are engaging with the product");
    }
  }
  
  // Calculate PMF score
  let pmfScore = 50; // Base score
  if (retentionRate >= 40) pmfScore += 15;
  if (churnRate < 5) pmfScore += 15;
  if (ltv > 0 && cac > 0 && (ltv / cac) >= 3) pmfScore += 20;
  if (revenue > 0) pmfScore += 10;
  pmfScore = Math.min(pmfScore, 100);
  
  const recommendations = [];
  
  if (retentionRate < 40) {
    recommendations.push({
      metric: "Retention Rate",
      recommendation: "Focus on onboarding improvements and delivering value in first week. Consider user interviews to understand drop-off points."
    });
  }
  
  if (churnRate > 5) {
    recommendations.push({
      metric: "Churn Rate",
      recommendation: "Implement exit surveys, improve customer success, and identify at-risk users before they churn."
    });
  }
  
  if (cac > 0 && ltv > 0 && (ltv / cac) < 3) {
    recommendations.push({
      metric: "LTV/CAC Ratio",
      recommendation: "Optimize acquisition channels, improve conversion rates, or increase pricing to improve unit economics."
    });
  }
  
  if (revenue === 0) {
    recommendations.push({
      metric: "Revenue",
      recommendation: "Focus on monetization strategy. Consider freemium model, usage-based pricing, or subscription tiers."
    });
  }
  
  return {
    healthAssessment,
    pmfScore,
    strengths: strengths.length > 0 ? strengths : ["Building early traction - continue focusing on user value"],
    concerns: concerns.length > 0 ? concerns : ["Early stage - metrics will improve as product matures"],
    recommendations,
    industryBenchmarks: {
      retentionRate: "Industry average: 40-60% for SaaS",
      cac: "Industry average: $50-200 depending on product",
      ltv: "Industry average: $500-2000+ depending on pricing"
    }
  };
}

function generateMockPortfolioAnalysis(companyData) {
  const { companyName, stage, metricsData = {} } = companyData;
  
  // Calculate health score
  let healthScore = 65; // Base score
  const scoreBreakdown = {
    traction: 70,
    team: 65,
    market: 70,
    financials: 60
  };
  
  const highlights = [
    `${companyName} is showing ${stage} stage traction`,
    "Team has relevant experience in the industry",
    "Market opportunity appears viable"
  ];
  
  const riskFactors = [
    "Early stage - metrics still developing",
    "Need to validate unit economics",
    "Market competition may intensify"
  ];
  
  const recommendedActions = [
    "Schedule monthly check-ins with founders",
    "Track key metrics on dashboard",
    "Provide strategic guidance on GTM strategy",
    "Connect with relevant industry contacts"
  ];
  
  let followOnRecommendation = "Wait";
  if (healthScore >= 75) {
    followOnRecommendation = "Yes";
  } else if (healthScore >= 60) {
    followOnRecommendation = "Wait";
  } else {
    followOnRecommendation = "No";
  }
  
  return {
    healthScore,
    scoreBreakdown,
    highlights,
    riskFactors,
    recommendedActions,
    followOnRecommendation,
    comparison: "Performing similarly to other portfolio companies at this stage"
  };
}

function generateMockChatResponse(message, journeyStep, conversationHistory = []) {
  // Simple keyword-based responses
  const lowerMessage = message.toLowerCase();
  
  let response = "I'd be happy to help you with that. ";
  
  if (lowerMessage.includes('idea') || lowerMessage.includes('validate')) {
    response += "For idea validation, focus on clearly defining the problem you're solving, who experiences it, and why your solution is unique. Consider conducting user interviews to validate assumptions.";
  } else if (lowerMessage.includes('market') || lowerMessage.includes('competition')) {
    response += "Market analysis should include size, growth trends, and competitive landscape. Look for gaps in existing solutions that your product can fill.";
  } else if (lowerMessage.includes('mvp') || lowerMessage.includes('features')) {
    response += "For MVP, prioritize features that deliver core value. Start with 3-5 must-have features, then validate with users before adding more.";
  } else if (lowerMessage.includes('funding') || lowerMessage.includes('investment')) {
    response += "When seeking funding, prepare a clear pitch deck, financial projections, and traction metrics. Show progress on key milestones.";
  } else if (lowerMessage.includes('launch') || lowerMessage.includes('go-to-market')) {
    response += "For launch, focus on your target audience's preferred channels. Start with content marketing and direct outreach, then scale with paid channels.";
  } else if (lowerMessage.includes('metrics') || lowerMessage.includes('analytics')) {
    response += "Key metrics to track include user acquisition, retention, engagement, and revenue. Focus on metrics that indicate product-market fit.";
  } else {
    response += "Consider focusing on your core value proposition, understanding your target customers deeply, and iterating based on feedback. Would you like more specific advice on any particular aspect?";
  }
  
  return response;
}

module.exports = {
  generateMockIdeaValidation,
  generateMockAISuite,
  generateMockMVPGuidance,
  generateMockGTMStrategy,
  generateMockMetricsAnalysis,
  generateMockPortfolioAnalysis,
  generateMockChatResponse
};

