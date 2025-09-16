// Lightweight email generator for demo purposes
const firstNames = ['alex', 'sam', 'jordan', 'taylor', 'casey', 'riley', 'morgan', 'jamie', 'drew', 'blake', 'chris', 'pat', 'lee', 'kim', 'max', 'quinn', 'sage', 'finley', 'hayden', 'parker'];
const lastNames = ['smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez', 'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson', 'thomas', 'taylor', 'moore', 'jackson', 'martin'];
const domains = ['example.com', 'demo.org', 'test.net', 'sample.co', 'mock.io'];

export const generateDemoEmail = () => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const randomDigits = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  return `${firstName}.${lastName}${randomDigits}@${domain}`;
};
