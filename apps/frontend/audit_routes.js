const fs = require('fs');
const path = require('path');

const sidebarPath = path.join(__dirname, 'src/components/Sidebar.tsx');
const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');

const regex = /href:\s*['"]([^'"]+)['"]/g;
const matches = [];
let match;
while ((match = regex.exec(sidebarContent)) !== null) {
  matches.push(match[1]);
}

const uniqueHrefs = [...new Set(matches)];
const pagesDir = path.join(__dirname, 'src/pages');

function routeExists(route) {
  const cleanRoute = route.split('?')[0].replace(/^\//, '').replace(/\/$/, '');
  if (cleanRoute === '') {
    return fs.existsSync(path.join(pagesDir, 'index.tsx')) || fs.existsSync(path.join(pagesDir, 'index.js'));
  }
  const fileAsTsx = path.join(pagesDir, cleanRoute + '.tsx');
  const fileAsIndex = path.join(pagesDir, cleanRoute, 'index.tsx');
  return fs.existsSync(fileAsTsx) || fs.existsSync(fileAsIndex);
}

const missing = [];
const existing = [];

for (const href of uniqueHrefs) {
  if (routeExists(href)) {
    existing.push(href);
  } else {
    missing.push(href);
  }
}

console.log('Total unique sidebar hrefs:', uniqueHrefs.length);
console.log('Existing routes (' + existing.length + '):', existing.length);
console.log('Missing routes (' + missing.length + '):', JSON.stringify(missing, null, 2));

