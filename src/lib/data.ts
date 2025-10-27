import type { Target, Threat, Vulnerability } from './types';

// Exploitability Index Calculation (as described in the prompt)
// A proprietary index based on CVSS score, asset type, and patch availability.
const calculateExploitabilityIndex = (
  cvss: number,
  assetType: Vulnerability['assetType'],
  patchAvailable: boolean
): number => {
  let assetMultiplier = 1;
  switch (assetType) {
    case 'API':
    case 'Database':
      assetMultiplier = 1.5;
      break;
    case 'Infrastructure':
      assetMultiplier = 1.2;
      break;
    case 'Frontend':
      assetMultiplier = 1.0;
      break;
  }

  const patchMultiplier = patchAvailable ? 0.8 : 1.2;
  const index = (cvss / 10) * assetMultiplier * patchMultiplier * 100;
  return Math.min(Math.round(index), 100);
};

const createVulnerability = (
  v: Omit<Vulnerability, 'exploitabilityIndex'>
): Vulnerability => ({
  ...v,
  exploitabilityIndex: calculateExploitabilityIndex(
    v.cvss,
    v.assetType,
    v.patchAvailable
  ),
});

export const targets: Target[] = [
  {
    id: 'T1',
    name: 'QuantumLeap API',
    url: 'api.quantumleap.tech',
    riskScore: 85,
  },
  {
    id: 'T2',
    name: 'Project Chimera Frontend',
    url: 'chimera.quantumleap.tech',
    riskScore: 45,
  },
];

export const vulnerabilities: Vulnerability[] = [
  createVulnerability({
    id: 'VULN-001',
    targetId: 'T1',
    name: 'Remote Code Execution in Auth Service',
    description:
      'A critical vulnerability in the session management module allows unauthenticated attackers to execute arbitrary code on the server.',
    cvss: 9.8,
    severity: 'Critical',
    assetType: 'API',
    patchAvailable: false,
    timestamp: '2024-07-21T10:00:00Z',
    status: 'Open',
  }),
  createVulnerability({
    id: 'VULN-002',
    targetId: 'T1',
    name: 'SQL Injection in User Profile Endpoint',
    description:
      'Improperly sanitized input on the user profile update endpoint allows for SQL injection, potentially exposing all user data.',
    cvss: 8.8,
    severity: 'High',
    assetType: 'Database',
    patchAvailable: true,
    timestamp: '2024-07-20T14:30:00Z',
    status: 'In Progress',
  }),
  createVulnerability({
    id: 'VULN-003',
    targetId: 'T2',
    name: 'Cross-Site Scripting (XSS) in Search Bar',
    description:
      'The search bar component does not properly encode user output, allowing for reflected Cross-Site Scripting attacks.',
    cvss: 6.1,
    severity: 'Medium',
    assetType: 'Frontend',
    patchAvailable: true,
    timestamp: '2024-07-19T09:00:00Z',
    status: 'Closed',
  }),
  createVulnerability({
    id: 'VULN-004',
    targetId: 'T1',
    name: 'Insecure Direct Object Reference (IDOR)',
    description:
      'The /api/v1/documents/:id endpoint lacks proper authorization checks, allowing users to access documents belonging to other users.',
    cvss: 7.5,
    severity: 'High',
    assetType: 'API',
    patchAvailable: false,
    timestamp: '2024-07-22T11:00:00Z',
    status: 'Open',
  }),
  createVulnerability({
    id: 'VULN-005',
    targetId: 'T2',
    name: 'Outdated Frontend Dependencies',
    description:
      'The application uses several frontend libraries with known vulnerabilities. These should be updated to the latest patched versions.',
    cvss: 5.3,
    severity: 'Medium',
    assetType: 'Frontend',
    patchAvailable: true,
    timestamp: '2024-07-22T12:00:00Z',
    status: 'Open',
  }),
];

export const threats: Threat[] = [
  {
    id: 'TH-1',
    message:
      "New RCE vulnerability discovered in 'log-parser-v2' library. Scanning assets...",
    severity: 'High',
  },
  {
    id: 'TH-2',
    message: 'Brute-force attempt detected on admin panel from IP 203.0.113.55.',
    severity: 'Medium',
  },
  {
    id: 'TH-3',
    message: "Security scan completed on 'Project Chimera Frontend'. 2 new medium vulnerabilities found.",
    severity: 'Low',
  },
  {
    id: 'TH-4',
    message:
      "Malicious payload detected in API request to '/api/v1/orders'. Request blocked.",
    severity: 'High',
  },
  {
    id: 'TH-5',
    message: 'System patch for CVE-2024-1337 successfully applied to 5 servers.',
    severity: 'Info',
  },
];

export const burndownData = [
  { date: '2024-07-15', open: 40, closed: 5 },
  { date: '2024-07-16', open: 38, closed: 7 },
  { date: '2024-07-17', open: 42, closed: 8 },
  { date: '2024-07-18', open: 35, closed: 15 },
  { date: '2024-07-19', open: 32, closed: 18 },
  { date: '2024-07-20', open: 30, closed: 20 },
  { date: '2024-07-21', open: 25, closed: 25 },
  { date: '2024-07-22', open: 28, closed: 26 },
];

export const heatmapData = [
    { component: 'API', risk: 85, vulnerabilities: 15 },
    { component: 'Database', risk: 70, vulnerabilities: 8 },
    { component: 'Frontend', risk: 45, vulnerabilities: 12 },
    { component: 'Infrastructure', risk: 60, vulnerabilities: 5 },
];
