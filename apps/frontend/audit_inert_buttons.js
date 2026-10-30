const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getAllFiles(dir, exts = ['.tsx']) {
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

const findings = [];

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(__dirname, file).replace(/\\/g, '/');

  // Check buttons with no onClick and not submit
  const buttonTags = content.match(/<button\b[^>]*>/g) || [];
  buttonTags.forEach(btn => {
    if (!btn.includes('onClick') && !btn.includes('type="submit"') && !btn.includes('type=\'submit\'') && !btn.includes('form=') && !btn.includes('disabled')) {
      findings.push({
        file: relPath,
        issue: 'BUTTON_WITHOUT_ONCLICK',
        tag: btn.slice(0, 100)
      });
    }
  });

  // Check for dummy handlers in JSX
  const dummyPatterns = [
    /onClick=\{\(\)\s*=>\s*alert\(/,
    /onClick=\{\(\)\s*=>\s*\{\s*\}\}/,
    /onClick=\{\(\)\s*=>\s*void\s*0\}/,
    /onClick=\{\(\)\s*=>\s*toast\.(info|warning)\(['"][^'"]*fitur[^'"]*['"]\)/i,
    /onClick=\{\(\)\s*=>\s*toast\.(info|warning)\(['"][^'"]*segera[^'"]*['"]\)/i,
    /onClick=\{\(\)\s*=>\s*toast\.(info|warning)\(['"][^'"]*dummy[^'"]*['"]\)/i,
    /onClick=\{\(\)\s*=>\s*toast\.(info|warning)\(['"][^'"]*belum[^'"]*['"]\)/i
  ];

  dummyPatterns.forEach(pattern => {
    let m = content.match(pattern);
    if (m) {
      findings.push({
        file: relPath,
        issue: 'DUMMY_OR_INERT_HANDLER',
        match: m[0]
      });
    }
  });
});

console.log('Total findings:', findings.length);
console.log(JSON.stringify(findings, null, 2));

