export const questionBank = {
  'software-engineer': [
    'Tell me about yourself and your background.',
    'Explain the difference between an array and a linked list.',
    'What is the time complexity of binary search and why?',
    'Describe a challenging bug you solved recently.',
    'How would you design a URL shortening service?',
  ],
  'frontend-developer': [
    'Tell me about yourself and your background.',
    'Explain the difference between controlled and uncontrolled inputs in React.',
    'How does the browser render a web page?',
    'What strategies do you use to optimize frontend performance?',
    'Describe a time you improved user experience in a project.',
  ],
  'backend-developer': [
    'Tell me about yourself and your background.',
    'What is the difference between SQL and NoSQL databases?',
    'How do you design a RESTful API?',
    'Explain how you would handle authentication in a web app.',
    'Describe a time you scaled a backend system.',
  ],
  'data-analyst': [
    'Tell me about yourself and your background.',
    'What steps do you take to clean a messy dataset?',
    'Explain the difference between INNER JOIN and LEFT JOIN.',
    'How would you measure the success of a product feature?',
    'Describe a dashboard you built and its impact.',
  ],
  'data-scientist': [
    'Tell me about yourself and your background.',
    'Explain bias-variance tradeoff.',
    'How would you handle missing data in a dataset?',
    'Describe a machine learning project end to end.',
    'How do you evaluate a classification model?',
  ],
  'ml-engineer': [
    'Tell me about yourself and your background.',
    'Explain how you would deploy a model to production.',
    'What is data drift and how do you detect it?',
    'Describe a time you optimized a model pipeline.',
    'How do you monitor models after deployment?',
  ],
  'cybersecurity-analyst': [
    'Tell me about yourself and your background.',
    'Explain the CIA triad.',
    'How would you respond to a phishing incident?',
    'What is the difference between symmetric and asymmetric encryption?',
    'Describe a time you found a security issue.',
  ],
  'devops-engineer': [
    'Tell me about yourself and your background.',
    'Explain the difference between Docker and Kubernetes.',
    'How would you design a CI/CD pipeline?',
    'Describe a time you improved deployment reliability.',
    'How do you monitor infrastructure health?',
  ],
};

export function getQuestionsForRole(roleId) {
  return questionBank[roleId] || questionBank['software-engineer'];
}
