# **App Name**: Quantum Vault

## Core Features:

- Data Ingestion: Cloud Function to ingest vulnerability data, calculate exploitability index based on CVSS, asset type, and patch availability, and write to Firestore.
- AI Remediation Tool: Cloud Function that, when triggered by a new critical vulnerability, uses a generative AI tool to generate a plain language summary and a developer code snippet.
- Real-Time Dashboard: Display live, animated 3D representation (Risk-Sphere) of application, dynamically changing based on aggregated risk score.
- Data Visualization: Display a Burndown Chart (Vulnerabilities vs. Time) and a Heatmap showing the concentration of risk by component.
- Live Threat Feed: Incorporate a subtle, scrolling 'Live Threat Feed' ticker at the bottom for simulated real-time intelligence.
- User Authentication: Implement Firebase Authentication to allow users to read/write their specific project data, controlled by Firebase Security Rules.
- Mock Data Endpoint: Integrate with a mock HTTPS endpoint to simulate data ingestion from an external vulnerability scanner (like OWASP ZAP).

## Style Guidelines:

- Dark mode theme with glassmorphism/neumorphism effects and primary neon blue (#08F7FE) and neon green (#00FF00) accents. Pulsating red (#FA0404) used exclusively for high-severity data. The choice of dark blues and greens reflects the prompt's instructions for a 'futuristic' look.
- Background color: Dark desaturated blue (#1A2933).
- Accent color: Electric green (#6CFA04).
- Body and headline font: 'Space Grotesk', a proportional sans-serif with a computerized, techy, scientific feel, suitable for both headlines and short amounts of body text
- Minimal navigation using abstract, high-tech icons.
- Glassmorphism/neumorphism effects (frosted/transparent panels) to create depth and a futuristic aesthetic.
- Dashboard should prioritize the Risk-Sphere 3D graphical representation as the central element.
- Subtle animations and transitions to enhance the futuristic feel of the interface. Risk-Sphere animates continuously, pulsating gently. Critical vulnerabilities trigger prominent animated alerts.