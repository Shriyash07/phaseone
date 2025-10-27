export type Vulnerability = {
  id: string;
  targetId: string;
  name: string;
  description: string;
  cvss: number;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  assetType: 'Database' | 'API' | 'Frontend' | 'Infrastructure';
  patchAvailable: boolean;
  timestamp: string;
  status: 'Open' | 'Closed' | 'In Progress';
  exploitabilityIndex: number;
  remediation?: {
    plainLanguageSummary: string;
    developerCodeSnippet: string;
  };
};

export type Target = {
  id: string;
  name: string;
  url: string;
  riskScore: number;
};

export type Threat = {
  id: string;
  message: string;
  severity: 'High' | 'Medium' | 'Low' | 'Info';
};
