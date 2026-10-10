/**
 * Script to automatically fix hardcoded URLs in frontend files
 * Run with: node fix-hardcoded-urls.js
 */

const fs = require('fs');
const path = require('path');

const FILES_TO_FIX = [
  'src/pages/work-order-detail.tsx',
  'src/pages/tickets.tsx',
  'src/pages/test-api.tsx',
  'src/pages/technician-monitoring.tsx',
  'src/pages/technician-checkin.tsx',
  'src/pages/reports.tsx',
  'src/pages/modem-monitor.tsx',
  'src/pages/invoice.tsx',
  'src/pages/inventory.tsx',
  'src/pages/field-service.tsx',
  'src/pages/backup.tsx',
  'src/pages/attendance-monitoring.tsx',
  'src/pages/audit-logs.tsx',
];

// Mapping of old URLs to new API_ENDPOINTS
const URL_MAPPINGS = {
  // Patterns to replace
  "'http://localhost:4000": "'${API_BASE_URL}",
  '"http://localhost:4000': '"${API_BASE_URL}',
  '`http://localhost:4000': '`${API_BASE_URL}',
};

console.log('🔧 Starting to fix hardcoded URLs...\n');

FILES_TO_FIX.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if already has import
  if (!content.includes('from \'../config/api\'') && !content.includes('from "../config/api"')) {
    // Add import after first import
    const firstImport = content.match(/import .+ from .+;/);
    if (firstImport) {
      content = content.replace(
        firstImport[0],
        `${firstImport[0]}\nimport { API_BASE_URL, API_ENDPOINTS } from '../config/api';`
      );
      modified = true;
    }
  }
  
  // Replace URLs
  Object.entries(URL_MAPPINGS).forEach(([oldUrl, newUrl]) => {
    if (content.includes(oldUrl)) {
      content = content.replace(new RegExp(oldUrl, 'g'), newUrl);
      modified = true;
    }
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${file}`);
  } else {
    console.log(`ℹ️  No changes needed: ${file}`);
  }
});

console.log('\n✨ Done!');
