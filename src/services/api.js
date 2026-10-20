import { getQuestionsForRole } from '../data/questions';
import { getRoleById } from '../data/roles';

const BASE_URL = import.meta.env?.VITE_API_URL || '';

async function safeFetch(path, options) {
  if (!BASE_URL) return null;
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function startInterview(roleId) {
  return safeFetch('/interviews', {
    method: 'POST',
    body: JSON.stringify({ role_id: roleId }),
  }) || {
    id: `int-${Date.now()}`,
    role: getRoleById(roleId).name,
    roleId,
    questions: getQuestionsForRole(roleId),
    startedAt: new Date().toISOString(),
  };
}

export async function getQuestions(roleId) {
  return getQuestionsForRole(roleId);
}

export async function submitAnswer(interviewId, question, answer) {
  return (
    safeFetch(`/interviews/${interviewId}/answer`, {
      method: 'POST',
      body: JSON.stringify({ question, answer }),
    }) || { ok: true }
  );
}

export function generateScores(answers) {
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
  const skills = role.skills.concat(['Communication', 'Problem Solving']);
  const seen = new Set();
  return skills
    .filter((s) => {
      if (seen.has(s)) return false;
      seen.add(s);
      return true;
    })
    .map((skill) => {
      const base = scores.overall + (Math.random() - 0.5) * 30;
      return { skill, score: clamp(base) };
    });
}

export function getRecommendations(skillGaps) {
  const recs = {
    DSA: 'Practice DSA arrays and two-pointer problems on LeetCode.',
    OOP: 'Revise OOP concepts: encapsulation, inheritance, polymorphism.',
    DBMS: 'Practice SQL joins and normalization scenarios.',
    'Problem Solving': 'Solve timed coding problems to improve speed.',
    Communication: 'Record yourself answering behavioral questions.',
    JavaScript: 'Build a small project using ES6+ features.',
    React: 'Review React hooks and component lifecycle patterns.',
    CSS: 'Practice responsive layouts with Flexbox and Grid.',
    Accessibility: 'Add ARIA labels and keyboard support to a project.',
    'API Design': 'Design a REST API for a small blog service.',
    'System Design': 'Study caching, load balancing and sharding basics.',
    Security: 'Review OWASP Top 10 and common web vulnerabilities.',
    SQL: 'Practice aggregate functions and subqueries.',
    Statistics: 'Revise probability distributions and hypothesis testing.',
    Excel: 'Practice pivot tables and lookup functions.',
    Visualization: 'Build dashboards using charts and color theory.',
    ML: 'Implement logistic regression from scratch in Python.',
    NLP: 'Fine-tune a small text classification model.',
    'Deep Learning': 'Build a CNN for image classification.',
    MLOps: 'Set up a model registry and experiment tracking.',
    Python: 'Practice writing clean, typed Python modules.',
    Cloud: 'Deploy a container to AWS ECS or GCP Cloud Run.',
    Networking: 'Study the OSI model and TCP handshake.',
    Cryptography: 'Practice AES and RSA encryption examples.',
    Linux: 'Learn common shell commands and permissions.',
    Forensics: 'Analyze a sample log file for suspicious activity.',
    Docker: 'Containerize a small app with a multi-stage Dockerfile.',
    Kubernetes: 'Deploy a service to a local minikube cluster.',
    AWS: 'Practice IAM policies and S3 bucket security.',
    'CI/CD': 'Build a GitHub Actions pipeline for a sample repo.',
  };

  const sorted = [...skillGaps].sort((a, b) => a.score - b.score);
  return sorted.slice(0, 4).map((g) => recs[g.skill] || `Practice ${g.skill} concepts.`);
}

export async function getInterviewResult(interviewId) {
  return safeFetch(`/interviews/${interviewId}/results`);
}

export async function getRecommendationsForUser(userId) {
  return safeFetch(`/users/${userId}/recommendations`);
}

function clamp(value) {
  return Math.max(35, Math.min(98, Math.round(value)));
}
