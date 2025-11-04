// API Configuration
const API_BASE_URL = 'http://localhost:3000/api';
let authToken = localStorage.getItem('authToken');
let currentUser = null;
let currentStep = 1;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    if (authToken) {
        checkAuth();
    } else {
        showAuthModal();
    }
    
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Auth forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Role selection change
    document.querySelectorAll('input[name="role"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const founderFields = document.getElementById('founderFields');
            if (e.target.value === 'founder') {
                founderFields.style.display = 'block';
            } else {
                founderFields.style.display = 'none';
            }
        });
    });
    
    // Founder journey forms
    document.getElementById('onboardingForm').addEventListener('submit', handleOnboarding);
    document.getElementById('ideaForm').addEventListener('submit', handleIdeaValidation);
    document.getElementById('aiSuiteForm').addEventListener('submit', handleAISuite);
    document.getElementById('mvpForm').addEventListener('submit', handleMVP);
    document.getElementById('gtmForm').addEventListener('submit', handleGTM);
    document.getElementById('pmfForm').addEventListener('submit', handlePMF);
    
    // Chat
    document.getElementById('sendChat').addEventListener('click', sendChatMessage);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

// Authentication
async function checkAuth() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            showApp();
        } else {
            localStorage.removeItem('authToken');
            showAuthModal();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        showAuthModal();
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    showLoading('Logging in...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            hideLoading();
            showApp();
        } else {
            showError('authError', data.error || 'Login failed');
            hideLoading();
        }
    } catch (error) {
        showError('authError', 'Network error. Please try again.');
        hideLoading();
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const role = document.querySelector('input[name="role"]:checked').value;
    const company = document.getElementById('registerCompany').value;
    const stage = document.getElementById('registerStage').value;
    
    showLoading('Creating account...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, company, stage })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            hideLoading();
            showApp();
        } else {
            showError('authError', data.error || 'Registration failed');
            hideLoading();
        }
    } catch (error) {
        showError('authError', 'Network error. Please try again.');
        hideLoading();
    }
}

function handleLogout() {
    localStorage.removeItem('authToken');
    authToken = null;
    currentUser = null;
    showAuthModal();
}

function showAuthTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tab}Tab`).classList.add('active');
    event.target.classList.add('active');
}

// UI Helpers
function showAuthModal() {
    document.getElementById('authModal').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}

function showApp() {
    document.getElementById('authModal').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    
    if (currentUser.role === 'founder') {
        document.getElementById('founderDashboard').classList.remove('hidden');
        document.getElementById('vcDashboard').classList.add('hidden');
        loadFounderJourney();
    } else {
        document.getElementById('founderDashboard').classList.add('hidden');
        document.getElementById('vcDashboard').classList.remove('hidden');
        loadVCDashboard();
    }
    
    document.getElementById('userInfo').textContent = `${currentUser.name || currentUser.email} (${currentUser.role.toUpperCase()})`;
}

function showLoading(text = 'Loading...') {
    document.getElementById('loadingText').textContent = text;
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.add('hidden');
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => {
        errorEl.style.display = 'none';
    }, 5000);
}

// Founder Journey
async function loadFounderJourney() {
    try {
        const response = await fetch(`${API_BASE_URL}/founder/journey`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentStep = data.journey.current_step || 1;
            updateStepDisplay();
        }
    } catch (error) {
        console.error('Load journey error:', error);
    }
}

function updateStepDisplay() {
    // Update progress bar
    const progress = (currentStep / 8) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    
    // Update steps list
    const stepsList = document.getElementById('stepsList');
    const stepNames = [
        'Onboarding',
        'Idea Validation',
        'AI Suite Configuration',
        'MVP Development',
        'Testing',
        'Go-to-Market',
        'Product-Market Fit',
        'Success'
    ];
    
    stepsList.innerHTML = stepNames.map((name, index) => {
        const stepNum = index + 1;
        let classes = 'step-item';
        if (stepNum === currentStep) classes += ' active';
        if (stepNum < currentStep) classes += ' completed';
        
        return `<div class="${classes}" onclick="goToStep(${stepNum})">${stepNum}. ${name}</div>`;
    }).join('');
    
    // Show current step
    document.querySelectorAll('.step-content').forEach((step, index) => {
        if (index + 1 === currentStep) {
            step.classList.remove('hidden');
        } else {
            step.classList.add('hidden');
        }
    });
}

function goToStep(step) {
    if (step <= currentStep) {
        currentStep = step;
        updateStepDisplay();
    }
}

function previousStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function nextStep() {
    if (currentStep < 8) {
        currentStep++;
        updateStepDisplay();
    }
}

// Step Handlers
async function handleOnboarding(e) {
    e.preventDefault();
    const data = {
        name: document.getElementById('founderName').value,
        email: currentUser.email,
        industry: document.getElementById('founderIndustry').value,
        experience: document.getElementById('founderExperience').value
    };
    
    showLoading('Saving...');
    
    try {
        await saveStepData(1, data);
        nextStep();
        hideLoading();
    } catch (error) {
        showError('authError', 'Failed to save. Please try again.');
        hideLoading();
    }
}

async function handleIdeaValidation(e) {
    e.preventDefault();
    const ideaData = {
        problemStatement: document.getElementById('problemStatement').value,
        targetAudience: document.getElementById('targetAudience').value,
        uniqueValue: document.getElementById('uniqueValue').value
    };
    
    showLoading('Analyzing your idea with AI...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/ai/validate-idea`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(ideaData)
        });
        
        const validation = await response.json();
        
        if (response.ok) {
            displayValidationResults(validation);
            await saveStepData(2, {
                ...ideaData,
                aiValidation: validation
            });
            document.getElementById('step2Next').disabled = false;
        } else {
            showError('authError', validation.error || 'Failed to validate idea');
        }
    } catch (error) {
        showError('authError', 'Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayValidationResults(validation) {
    const resultsDiv = document.getElementById('aiValidationResults');
    resultsDiv.classList.remove('hidden');
    
    document.getElementById('marketSize').textContent = validation.marketSize || 'Analysis pending';
    
    const competitorsList = document.getElementById('competitors');
    competitorsList.innerHTML = (validation.competitors || [])
        .map(comp => `<li><strong>${comp.name}</strong>: ${comp.description || ''}</li>`)
        .join('');
    
    const score = validation.feasibilityScore || 50;
    document.getElementById('feasibilityScore').textContent = score;
    document.getElementById('feasibilityExplanation').textContent = validation.explanation || 'Analysis in progress';
    
    const scoreEl = document.getElementById('feasibilityScore');
    if (score >= 70) scoreEl.style.color = '#10b981';
    else if (score >= 40) scoreEl.style.color = '#f59e0b';
    else scoreEl.style.color = '#ef4444';
    
    const recsList = document.getElementById('recommendations');
    recsList.innerHTML = (validation.recommendations || [])
        .map(rec => `<li>${rec}</li>`)
        .join('');
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML += `<div class="chat-message user">${message}</div>`;
    input.value = '';
    
    showLoading('AI is thinking...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                message,
                journeyStep: 'step2',
                context: {}
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            chatMessages.innerHTML += `<div class="chat-message assistant">${data.message}</div>`;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        } else {
            showError('authError', 'Failed to get AI response');
        }
    } catch (error) {
        showError('authError', 'Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

async function handleAISuite(e) {
    e.preventDefault();
    const customRequirements = document.getElementById('customRequirements').value;
    
    showLoading('Getting AI recommendations...');
    
    try {
        // Get previous step data for context
        const step2Response = await fetch(`${API_BASE_URL}/founder/journey/step/2`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const step2Data = step2Response.ok ? await step2Response.json() : null;
        
        const response = await fetch(`${API_BASE_URL}/ai/recommend-tools`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                industry: step2Data?.data?.industry || 'General',
                problemStatement: step2Data?.data?.problemStatement || '',
                targetAudience: step2Data?.data?.targetAudience || '',
                features: []
            })
        });
        
        const recommendations = await response.json();
        
        if (response.ok) {
            displayAISuiteRecommendations(recommendations);
            await saveStepData(3, {
                customRequirements,
                aiRecommendations: recommendations
            });
            document.getElementById('step3Next').disabled = false;
        } else {
            showError('authError', recommendations.error || 'Failed to get recommendations');
        }
    } catch (error) {
        showError('authError', 'Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayAISuiteRecommendations(recommendations) {
    const resultsDiv = document.getElementById('aiRecommendations');
    resultsDiv.classList.remove('hidden');
    
    const toolsDiv = document.getElementById('recommendedTools');
    toolsDiv.innerHTML = (recommendations.tools || []).map(tool => `
        <div class="validation-card">
            <h4>${tool.category}: ${tool.name}</h4>
            <p><strong>Provider:</strong> ${tool.provider}</p>
            <p><strong>Use Case:</strong> ${tool.useCase}</p>
            <p><strong>Integration:</strong> ${tool.integrationComplexity}</p>
            <p><strong>Cost:</strong> ${tool.estimatedCost}</p>
            <p><strong>ROI:</strong> ${tool.expectedROI}</p>
        </div>
    `).join('');
}

async function handleMVP(e) {
    e.preventDefault();
    const features = Array.from(document.querySelectorAll('.feature-item input'))
        .map(input => input.value)
        .filter(v => v.trim());
    const timeline = document.getElementById('mvpTimeline').value;
    
    showLoading('Generating MVP guidance...');
    
    try {
        const step2Response = await fetch(`${API_BASE_URL}/founder/journey/step/2`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        const step2Data = step2Response.ok ? await step2Response.json() : null;
        
        const response = await fetch(`${API_BASE_URL}/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                message: `Help me prioritize MVP features. Features: ${features.join(', ')}. Timeline: ${timeline} weeks.`,
                journeyStep: 'step4',
                context: {
                    problemStatement: step2Data?.data?.problemStatement || '',
                    targetAudience: step2Data?.data?.targetAudience || ''
                }
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('mvpGuidance').classList.remove('hidden');
            document.getElementById('mvpPlan').innerHTML = `
                <div class="validation-card">
                    <h4>AI MVP Guidance</h4>
                    <p>${data.message}</p>
                </div>
            `;
            await saveStepData(4, { features, timeline });
            document.getElementById('step4Next').disabled = false;
        }
    } catch (error) {
        showError('authError', 'Failed to get MVP guidance');
    } finally {
        hideLoading();
    }
}

async function handleGTM(e) {
    e.preventDefault();
    const gtmData = {
        productDescription: document.getElementById('productDescription').value,
        targetAudience: document.getElementById('targetAudience').value,
        marketingBudget: document.getElementById('marketingBudget').value,
        launchTimeline: document.getElementById('launchTimeline').value
    };
    
    showLoading('Generating GTM strategy...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/ai/generate-gtm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(gtmData)
        });
        
        const strategy = await response.json();
        
        if (response.ok) {
            displayGTMStrategy(strategy);
            await saveStepData(6, gtmData);
            document.getElementById('step6Next').disabled = false;
        } else {
            showError('authError', strategy.error || 'Failed to generate strategy');
        }
    } catch (error) {
        showError('authError', 'Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayGTMStrategy(strategy) {
    const resultsDiv = document.getElementById('gtmStrategy');
    resultsDiv.classList.remove('hidden');
    
    const planDiv = document.getElementById('gtmPlan');
    planDiv.innerHTML = `
        <div class="validation-card">
            <h4>Marketing Channels</h4>
            ${(strategy.channels || []).map(ch => `
                <p><strong>${ch.name}</strong> (Priority ${ch.priority})</p>
                <ul>
                    ${(ch.tactics || []).map(t => `<li>${t}</li>`).join('')}
                </ul>
            `).join('')}
        </div>
        <div class="validation-card">
            <h4>First 90 Days</h4>
            <p><strong>Days 1-30:</strong> ${strategy.first90Days?.['days1-30'] || 'N/A'}</p>
            <p><strong>Days 31-60:</strong> ${strategy.first90Days?.['days31-60'] || 'N/A'}</p>
            <p><strong>Days 61-90:</strong> ${strategy.first90Days?.['days61-90'] || 'N/A'}</p>
        </div>
    `;
}

async function handlePMF(e) {
    e.preventDefault();
    const metrics = {
        totalUsers: document.getElementById('totalUsers').value,
        activeUsers: document.getElementById('activeUsers').value,
        retentionRate: document.getElementById('retentionRate').value,
        churnRate: document.getElementById('churnRate').value,
        revenue: document.getElementById('revenue').value,
        cac: document.getElementById('cac').value,
        ltv: document.getElementById('ltv').value
    };
    
    showLoading('Analyzing metrics...');
    
    try {
        const response = await fetch(`${API_BASE_URL}/ai/analyze-metrics`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(metrics)
        });
        
        const analysis = await response.json();
        
        if (response.ok) {
            displayPMFAnalysis(analysis);
            await saveStepData(7, metrics);
            document.getElementById('step7Next').disabled = false;
        } else {
            showError('authError', analysis.error || 'Failed to analyze metrics');
        }
    } catch (error) {
        showError('authError', 'Network error. Please try again.');
    } finally {
        hideLoading();
    }
}

function displayPMFAnalysis(analysis) {
    const resultsDiv = document.getElementById('pmfAnalysis');
    resultsDiv.classList.remove('hidden');
    
    const resultsDivInner = document.getElementById('pmfResults');
    const healthColor = analysis.healthAssessment === 'Green' ? '#10b981' : 
                      analysis.healthAssessment === 'Yellow' ? '#f59e0b' : '#ef4444';
    
    resultsDivInner.innerHTML = `
        <div class="validation-card">
            <h4>Health Assessment: <span style="color: ${healthColor}">${analysis.healthAssessment}</span></h4>
            <p><strong>PMF Score:</strong> ${analysis.pmfScore}/100</p>
        </div>
        <div class="validation-card">
            <h4>Strengths</h4>
            <ul>${(analysis.strengths || []).map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="validation-card">
            <h4>Concerns</h4>
            <ul>${(analysis.concerns || []).map(c => `<li>${c}</li>`).join('')}</ul>
        </div>
        <div class="validation-card">
            <h4>Recommendations</h4>
            <ul>${(analysis.recommendations || []).map(r => `<li><strong>${r.metric}:</strong> ${r.recommendation}</li>`).join('')}</ul>
        </div>
    `;
}

// Helper functions
async function saveStepData(stepNumber, data) {
    const response = await fetch(`${API_BASE_URL}/founder/journey/step/${stepNumber}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Failed to save step data');
    }
}

function addFeature() {
    const featuresList = document.getElementById('featuresList');
    const featureDiv = document.createElement('div');
    featureDiv.className = 'feature-item';
    featureDiv.innerHTML = `
        <input type="text" placeholder="Feature name">
        <button type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
    featuresList.appendChild(featureDiv);
}

// VC Dashboard
async function loadVCDashboard() {
    try {
        const [portfolioRes, analyticsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/vc/portfolio`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            }),
            fetch(`${API_BASE_URL}/vc/analytics`, {
                headers: { 'Authorization': `Bearer ${authToken}` }
            })
        ]);
        
        if (portfolioRes.ok) {
            const portfolio = await portfolioRes.json();
            // Display portfolio
        }
        
        if (analyticsRes.ok) {
            const analytics = await analyticsRes.json();
            updateVCAnalytics(analytics.analytics);
        }
    } catch (error) {
        console.error('Load VC dashboard error:', error);
    }
}

function updateVCAnalytics(analytics) {
    document.getElementById('totalCompanies').textContent = analytics.totalCompanies || 0;
    document.getElementById('totalInvested').textContent = `$${(analytics.totalInvested || 0).toLocaleString()}`;
    document.getElementById('avgHealthScore').textContent = Math.round(analytics.averageHealthScore || 0);
}

function showVCTab(tab) {
    document.querySelectorAll('.vc-tab-content').forEach(t => t.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tab}Tab`).classList.remove('hidden');
    event.target.classList.add('active');
}

