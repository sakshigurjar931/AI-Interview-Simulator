import { getRoleById } from '../data/roles';
import { getQuestionsForRole } from '../data/questions';

export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.VITE_API_URL ||
  'http://127.0.0.1:8000';

/**
 * Central API fetch helper with robust error handling
 */
export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errorMsg =
        (typeof data === 'object' && (data.detail || data.message)) ||
        `HTTP ${response.status}: ${response.statusText}`;
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(
        `Unable to reach the backend server at ${API_BASE_URL}. Please ensure FastAPI is running.`
      );
    }
    throw error;
  }
}

// ----------------------------------------------------------------------
// Authentication APIs
// ----------------------------------------------------------------------

export async function registerUser({ name, email, password }) {
  return apiFetch('/users/', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser({ email, password }) {
  return apiFetch('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ----------------------------------------------------------------------
// Job Roles APIs
// ----------------------------------------------------------------------

export async function getJobRoles() {
  return apiFetch('/job-roles/');
}

// ----------------------------------------------------------------------
// Interview Session APIs
// ----------------------------------------------------------------------

export async function createInterviewSession({ userId, jobRoleId }) {
  return apiFetch('/interview-sessions/', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      job_role_id: jobRoleId,
    }),
  });
}

export async function getUserSessions(userId) {
  return apiFetch(`/interview-sessions/user/${userId}`);
}

export async function getSessionSummary(sessionId) {
  return apiFetch(`/interview-sessions/${sessionId}/summary`);
}

// ----------------------------------------------------------------------
// AI Interview Flow APIs
// ----------------------------------------------------------------------

export async function generateAiQuestions({ sessionId, jobRole, difficulty = 'Medium', count = 5 }) {
  return apiFetch('/ai/generate-questions', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      job_role: jobRole,
      difficulty,
      count,
    }),
  });
}

export async function evaluateAnswer({ questionId, answer }) {
  return apiFetch('/ai/evaluate-answer', {
    method: 'POST',
    body: JSON.stringify({
      question_id: questionId,
      answer: answer || '',
    }),
  });
}

export async function generateAiFeedback({ sessionId, jobRole }) {
  return apiFetch('/ai/generate-feedback', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      job_role: jobRole,
    }),
  });
}

export async function analyzeAiSkillGap({ sessionId, jobRole }) {
  return apiFetch('/ai/analyze-skill-gap', {
    method: 'POST',
    body: JSON.stringify({
      session_id: sessionId,
      job_role: jobRole,
    }),
  });
}

// ----------------------------------------------------------------------
// Recommendation & Fallback Utilities
// ----------------------------------------------------------------------

export function getRecommendations(skillGaps = []) {
  const recs = {
    DSA: 'Practice DSA arrays and two-pointer problems on LeetCode.',
    OOP: 'Revise OOP concepts: encapsulation, inheritance, polymorphism.',
    DBMS: 'Practice SQL joins and normalization scenarios.',
    'Problem Solving': 'Solve timed coding problems to improve speed.',
    Communication: 'Record yourself answering behavioral questions with the STAR method.',
    JavaScript: 'Build a small project using modern ES6+ features and async/await.',
    React: 'Review React hooks, state management, and component lifecycle patterns.',
    CSS: 'Practice responsive layouts with Flexbox and CSS Grid.',
    Accessibility: 'Add ARIA labels and keyboard navigation support to your UI.',
    'API Design': 'Design a RESTful API with validation and clear status codes.',
    'System Design': 'Study caching, load balancing, and sharding fundamentals.',
    Security: 'Review OWASP Top 10 vulnerabilities and secure authentication practices.',
    SQL: 'Practice SQL aggregations, window functions, and subqueries.',
    Statistics: 'Revise probability distributions and hypothesis testing.',
    Excel: 'Practice pivot tables, VLOOKUP, and INDEX/MATCH functions.',
    Visualization: 'Build interactive dashboards using chart libraries.',
    ML: 'Implement core machine learning algorithms from scratch in Python.',
    NLP: 'Fine-tune a text classification model using Hugging Face.',
    'Deep Learning': 'Build neural network architectures using PyTorch or TensorFlow.',
    MLOps: 'Set up automated model pipelines and artifact versioning.',
    Python: 'Practice writing clean, PEP8-compliant, typed Python code.',
    Cloud: 'Deploy containerized services to AWS, GCP, or Azure.',
    Networking: 'Study TCP/IP protocols, DNS resolution, and TLS handshakes.',
    Cryptography: 'Explore symmetric and asymmetric encryption implementations.',
    Linux: 'Master command-line tools, file permissions, and shell scripting.',
    Forensics: 'Analyze server access logs to detect anomalous access patterns.',
    Docker: 'Containerize multi-container applications using Docker Compose.',
    Kubernetes: 'Deploy scalable services with pods, deployments, and ingress.',
    AWS: 'Configure IAM policies, S3 buckets, and EC2/ECS workloads.',
    'CI/CD': 'Build automated test and deployment pipelines with GitHub Actions.',
  };

  const list = Array.isArray(skillGaps) ? skillGaps : [];
  if (list.length === 0) {
    return [
      'Practice core computer science fundamentals and algorithms.',
      'Structure technical explanations clearly using the STAR framework.',
      'Build end-to-end projects demonstrating real-world problem-solving.',
    ];
  }

  return list.slice(0, 4).map((g) => {
    const key = typeof g === 'string' ? g : g.skill || '';
    return recs[key] || `Deepen your knowledge of ${key || 'core concepts'} through hands-on practice.`;
  });
}

export function generateScores(answers = []) {
  const count = answers.length || 1;
  const avgLength =
    answers.reduce((acc, a) => acc + (a.answer?.length || 0), 0) / count;

  const base = 55;
  const lengthBonus = Math.min(avgLength / 20, 20);
  const variance = Math.round((Math.random() - 0.5) * 10);

  const overall = clamp(base + lengthBonus + variance);
  const technical = clamp(overall + (Math.random() - 0.5) * 14);
  const communication = clamp(overall + (Math.random() - 0.5) * 10);
  const confidence = clamp(overall + (Math.random() - 0.5) * 12);
  const relevance = clamp(overall + (Math.random() - 0.5) * 8);

  return {
    overall: Math.round(overall),
    technical: Math.round(technical),
    communication: Math.round(communication),
    confidence: Math.round(confidence),
    relevance: Math.round(relevance),
  };
}

export function generateFeedback(scores) {
  const strengths = [];
  const improvements = [];

  if (scores.technical >= 75) strengths.push('Strong technical understanding of core concepts.');
  else improvements.push('Deepen your technical knowledge of core CS fundamentals.');

  if (scores.communication >= 75) strengths.push('Clear and structured communication.');
  else improvements.push('Structure answers using the STAR method for clarity.');

  if (scores.confidence >= 75) strengths.push('Confident and steady delivery.');
  else improvements.push('Practice speaking aloud to build confidence.');

  if (scores.relevance >= 75) strengths.push('Answers stayed relevant to the question.');
  else improvements.push('Keep answers focused and avoid drifting off-topic.');

  if (strengths.length === 0) strengths.push('Willingness to attempt every question.');
  if (improvements.length === 0) improvements.push('Keep refining your examples for impact.');

  return { strengths, improvements };
}

export function generateSkillGaps(roleId, scores) {
  const role = getRoleById(roleId);
  const skills = (role?.skills || []).concat(['Communication', 'Problem Solving']);
  const seen = new Set();
  return skills
    .filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    })
    .map((skill) => {
      const base = (scores?.overall || 70) + (Math.random() - 0.5) * 30;
      return { skill, score: clamp(base) };
    });
}

function clamp(value) {
  return Math.max(35, Math.min(98, Math.round(value)));
}
