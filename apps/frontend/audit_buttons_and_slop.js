const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, exts = ['.tsx', '.ts']) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      if (exts.includes(path.extname(fullPath))) {
        results.push(fullPath);
      }
    }
  });
  return results;
}

const files = getAllFiles(srcDir);

const inactiveOrDummyPatterns = [
  /onClick=\{?\(\)\s*=>\s*\{\}\}?/g,
  /onClick=\{?\(\)\s*=>\s*undefined\}?/g,
  /toast\.(info|warning|error|success)\([^)]*(belum|pengembangan|segera|coming soon|dummy|placeholder|tahap pembangunan)[^)]*\)/gi,
  /onClick=\{?\(\)\s*=>\s*console\.log/g
];

const slopWords = [
  /\bseamlessly\b/gi,
  /\bdelve\b/gi,
  /\bleverage\b/gi,
  /\bgame-changer\b/gi,
  /\bharness the power\b/gi,
  /\bcutting-edge\b/gi,
  /\btest your knowledge\b/gi,
  /\btapestry\b/gi,
  /\btestament to\b/gi,
  /\belevate your\b/gi,
  /\bultimate solution\b/gi
];

console.log('Auditing ' + files.length + ' files in src/ ...');

const issues = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(__dirname, file).replace(/\\/g, '/');

  inactiveOrDummyPatterns.forEach((pat, i) => {
    let match;
    while ((match = pat.exec(content)) !== null) {
      issues.push({
        file: relPath,
        type: 'INACTIVE_OR_DUMMY_BUTTON',
        match: match[0],
        index: match.index
      });
    }
  });

  slopWords.forEach((pat) => {
    let match;
    while ((match = pat.exec(content)) !== null) {
      issues.push({
        file: relPath,
        type: 'AI_SLOP_WORD',
        match: match[0],
        index: match.index
      });
    }
  });
});

console.log('Total issues found:', issues.length);
const grouped = {};
issues.forEach(iss => {
  if (!grouped[iss.file]) grouped[iss.file] = [];
  grouped[iss.file].push(iss);
});

console.log(JSON.stringify(grouped, null, 2));

