const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src/pages');

function getFiles(dir) {
  let res = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      res = res.concat(getFiles(full));
    } else if (entry.name.endsWith('.tsx') && !entry.name.startsWith('_')) {
      res.push(full);
    }
  }
  return res;
}

const allPages = getFiles(pagesDir);
console.log('Total pages found:', allPages.length);

const suspectPages = [];

for (const p of allPages) {
  const content = fs.readFileSync(p, 'utf8');
  const rel = path.relative(pagesDir, p).replace(/\\/g, '/');

  const reasons = [];

  // Check for inert/placeholder toasts
  if (/toast\.(info|warning|error)\([^)]*(belum|pengembangan|segera|dummy|placeholder|tahap)[^)]*\)/i.test(content)) {
    reasons.push('has placeholder toast');
  }

  // Check for alert
  if (/alert\(/i.test(content)) {
    reasons.push('has browser alert');
  }

  // Check for empty onClick
  if (/onClick=\{\(\)\s*=>\s*\{\s*\}\}/.test(content)) {
    reasons.push('has empty onClick');
  }

  // Check for console.log in onClick
  if (/onClick=\{\(\)\s*=>\s*console\.log/.test(content)) {
    reasons.push('has console.log in onClick');
  }

  // Check for slop words
  const slopRegex = /\b(seamlessly|delve|leverage|game-changer|harness the power|cutting-edge|test your knowledge|tapestry|testament to|elevate your|ultimate solution)\b/i;
  const slopMatch = content.match(slopRegex);
  if (slopMatch) {
    reasons.push(`has slop word: "${slopMatch[0]}"`);
  }

  // Check for em dashes
  if (content.includes('—')) {
    reasons.push('has em-dash');
  }

  // Check for multi-stop via- gradients
  if (content.includes('via-')) {
    reasons.push('has via- gradient');
  }

  // Check for sparkles
  if (content.includes('Sparkles')) {
    reasons.push('has Sparkles icon');
  }

  if (reasons.length > 0) {
    suspectPages.push({ file: rel, reasons });
  }
}

console.log('Suspect pages count:', suspectPages.length);
console.log(JSON.stringify(suspectPages, null, 2));

