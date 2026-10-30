import {
  Code2,
  Layout,
  Server,
  Database,
  BrainCircuit,
  Cpu,
  ShieldCheck,
  GitBranch,
} from 'lucide-react';

export const roles = [
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    icon: Code2,
    description: 'Data structures, algorithms, system design and core CS fundamentals.',
    difficulty: 'Intermediate',
    skills: ['DSA', 'OOP', 'DBMS', 'Problem Solving'],
  },
  {
    id: 'frontend-developer',
    name: 'Frontend Developer',
    icon: Layout,
    description: 'HTML, CSS, JavaScript, React and modern UI engineering.',
    difficulty: 'Beginner',
    skills: ['JavaScript', 'React', 'CSS', 'Accessibility'],
  },
  {
    id: 'backend-developer',
    name: 'Backend Developer',
    icon: Server,
    description: 'APIs, databases, server architecture and backend scalability.',
    difficulty: 'Intermediate',
    skills: ['API Design', 'DBMS', 'System Design', 'Security'],
  },
  {
    id: 'data-analyst',
    name: 'Data Analyst',
    icon: Database,
    description: 'SQL, data wrangling, visualization and analytical thinking.',
    difficulty: 'Beginner',
    skills: ['SQL', 'Statistics', 'Excel', 'Visualization'],
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    icon: BrainCircuit,
    description: 'Machine learning, statistics, Python and model evaluation.',
    difficulty: 'Advanced',
    skills: ['ML', 'Statistics', 'Python', 'NLP'],
  },
  {
    id: 'ml-engineer',
    name: 'Machine Learning Engineer',
    icon: Cpu,
    description: 'Model deployment, MLOps, deep learning and production systems.',
    difficulty: 'Advanced',
    skills: ['Deep Learning', 'MLOps', 'Python', 'Cloud'],
  },
  {
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    icon: ShieldCheck,
    description: 'Threat analysis, network security and incident response.',
    difficulty: 'Advanced',
    skills: ['Networking', 'Cryptography', 'Linux', 'Forensics'],
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    icon: GitBranch,
    description: 'CI/CD, containers, cloud infrastructure and automation.',
    difficulty: 'Intermediate',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
  },
];

export function getRoleById(id) {
  return roles.find((r) => r.id === id) || roles[0];
}
