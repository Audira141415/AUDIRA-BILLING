const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      getFiles(full, files);
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      files.push(full);
    }
  }
  return files;
}

function refactorCode(content) {
  let s = content;

  // 1. Canvases & Outer page containers
  s = s.replaceAll(/min-h-screen\s+bg-\[#(080d19|070c19|050B14|07101F|071225|081120|081225|091526|0A1629|0B1528|0c152a|0c1d36|0d1425|0f1d38|101935|101c3a|020617)\]\s+text-gray-200\s+p-4\s+md:p-6\s+space-y-6\s+overflow-hidden/g, 'min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 space-y-6');
  s = s.replaceAll(/min-h-screen\s+bg-\[#(080d19|070c19|050B14|07101F|071225|081120|081225|091526|0A1629|0B1528|0c152a|0c1d36|0d1425|0f1d38|101935|101c3a|020617)\]\s+text-gray-200\s+p-4\s+md:p-6\s+space-y-6/g, 'min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 space-y-6');
  s = s.replaceAll(/min-h-screen\s+bg-\[#(080d19|070c19|050B14|07101F|071225|081120|081225|091526|0A1629|0B1528|0c152a|0c1d36|0d1425|0f1d38|101935|101c3a|020617)\]\s+text-gray-200/g, 'min-h-screen bg-slate-50 text-slate-800');
  s = s.replaceAll(/min-h-screen\s+bg-\[#(080d19|070c19|050B14|07101F|071225|081120|081225|091526|0A1629|0B1528|0c152a|0c1d36|0d1425|0f1d38|101935|101c3a|020617)\]/g, 'min-h-screen bg-slate-50');

  // Generic dark canvas tokens
  const darkCanvases = [
    'bg-[#080d19]', 'bg-[#070c19]', 'bg-[#050B14]', 'bg-[#07101F]',
    'bg-[#071225]', 'bg-[#081120]', 'bg-[#081225]', 'bg-[#091526]',
    'bg-[#0A1629]', 'bg-[#0B1528]', 'bg-[#0c152a]', 'bg-[#0c1d36]',
    'bg-[#0d1425]', 'bg-[#0f1d38]', 'bg-[#101935]', 'bg-[#101c3a]',
    'bg-[#020617]', 'bg-slate-950', 'bg-gray-950'
  ];
  for (const c of darkCanvases) {
    s = s.replaceAll(c, 'bg-slate-50');
  }

  // 2. Card Containers & Surfaces
  s = s.replaceAll(/bg-\[#(0b1329|0E1B35|0d1424)\]\s+border\s+border-\[#(131d35|1e293b|18264e|1e2d54|1e2e58)\]\s+rounded-2xl\s+p-5/g, 'bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs');
  s = s.replaceAll(/bg-\[#(0b1329|0E1B35|0d1424)\]\s+border\s+border-\[#(131d35|1e293b|18264e|1e2d54|1e2e58)\]\s+rounded-2xl\s+p-6/g, 'bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs');
  s = s.replaceAll(/bg-\[#(0b1329|0E1B35|0d1424)\]\s+border\s+border-\[#(131d35|1e293b|18264e|1e2d54|1e2e58)\]\s+rounded-2xl/g, 'bg-white border border-slate-200 rounded-2xl shadow-2xs');
  s = s.replaceAll(/bg-\[#(0b1329|0E1B35|0d1424)\]\s+border\s+border-\[#(131d35|1e293b|18264e|1e2d54|1e2e58)\]/g, 'bg-white border border-slate-200');
  s = s.replaceAll('bg-[#0b1329]', 'bg-white');
  s = s.replaceAll('bg-[#0E1B35]', 'bg-white');
  s = s.replaceAll('bg-[#0d1424]', 'bg-white');

  // 3. Inputs, Filters, Sub-boxes, Tabs
  s = s.replaceAll('bg-[#131d35]/50 border border-[#131d35]', 'bg-slate-50 border border-slate-200');
  s = s.replaceAll('bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35]', 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900');
  s = s.replaceAll('bg-[#131d35]/35', 'bg-slate-100');
  s = s.replaceAll('bg-[#131d35]/30', 'bg-slate-100');
  s = s.replaceAll('bg-[#131d35]/20', 'bg-slate-50');
  s = s.replaceAll('bg-[#131d35]', 'bg-slate-100');
  s = s.replaceAll('bg-[#121c38]', 'bg-slate-100');
  s = s.replaceAll('bg-[#1a2a4a]', 'bg-slate-100');
  s = s.replaceAll('bg-[#1b2647]', 'bg-slate-100');
  s = s.replaceAll('bg-[#1e293b]', 'bg-slate-100');
  s = s.replaceAll('bg-[#1e2d54]', 'bg-slate-100');

  s = s.replaceAll('bg-[#0d1527] border border-[#1e293b]', 'bg-slate-50 border border-slate-200 text-slate-700');
  s = s.replaceAll('bg-[#0d1527] border border-[#131d35]', 'bg-slate-50 border border-slate-200 text-slate-700');
  s = s.replaceAll('bg-[#0d1527]', 'bg-slate-50');

  // 4. Borders & Dividers
  s = s.replaceAll('border-[#131d35]/30', 'border-slate-200/60');
  s = s.replaceAll('border-[#131d35]', 'border-slate-200');
  s = s.replaceAll('border-[#1e293b]', 'border-slate-200');
  s = s.replaceAll('border-[#18264e]', 'border-slate-200');
  s = s.replaceAll('border-[#1e2d54]', 'border-slate-200');
  s = s.replaceAll('border-[#1e2e58]', 'border-slate-200');
  s = s.replaceAll('border-[#050B14]', 'border-slate-200');
  s = s.replaceAll('border-[#070c19]', 'border-slate-200');
  s = s.replaceAll('border-[#0b1329]', 'border-slate-200');
  s = s.replaceAll('border-[#172342]', 'border-slate-200');
  s = s.replaceAll('border-[#1F293D]', 'border-slate-200');
  s = s.replaceAll('border-[#243356]', 'border-slate-200');

  s = s.replaceAll('divide-[#131d35]', 'divide-slate-200');
  s = s.replaceAll('divide-[#1e293b]', 'divide-slate-200');

  // 5. Hovers
  s = s.replaceAll('hover:bg-[#121c38]', 'hover:bg-slate-50');
  s = s.replaceAll('hover:bg-[#131d35]/20', 'hover:bg-slate-50');
  s = s.replaceAll('hover:bg-[#131d35]', 'hover:bg-slate-100');
  s = s.replaceAll('hover:bg-[#172342]', 'hover:bg-slate-100');
  s = s.replaceAll('hover:bg-white/5', 'hover:bg-slate-50');
  s = s.replaceAll('hover:bg-white/10', 'hover:bg-slate-100');

  // 6. Text Contrast (for elements newly on white/slate-50 cards)
  s = s.replaceAll('<h1 className="text-2xl font-bold text-white', '<h1 className="text-2xl font-bold text-slate-900');
  s = s.replaceAll('<h2 className="text-base font-bold text-white', '<h2 className="text-base font-bold text-slate-900');
  s = s.replaceAll('<h3 className="text-sm font-bold text-white', '<h3 className="text-sm font-bold text-slate-900');
  s = s.replaceAll('<h4 className="font-bold text-white', '<h4 className="font-bold text-slate-900');
  s = s.replaceAll('font-black text-white', 'font-black text-slate-900');
  s = s.replaceAll('font-extrabold text-white', 'font-extrabold text-slate-900');
  s = s.replaceAll('font-bold text-white cursor-pointer hover:text-blue-400', 'font-bold text-slate-800 cursor-pointer hover:text-blue-600');
  s = s.replaceAll('font-bold text-white', 'font-bold text-slate-800');
  s = s.replaceAll('text-white focus:outline-none focus:border-blue-500', 'text-slate-800 focus:outline-none focus:border-blue-500');
  s = s.replaceAll('text-white placeholder-gray-500', 'text-slate-800 placeholder-slate-400');
  s = s.replaceAll('text-white tracking-tight', 'text-slate-900 tracking-tight');
  s = s.replaceAll('text-gray-400 hover:text-white', 'text-slate-500 hover:text-slate-900');
  s = s.replaceAll('text-gray-300 font-semibold', 'text-slate-700 font-semibold');
  s = s.replaceAll('text-gray-300', 'text-slate-600');
  s = s.replaceAll('text-gray-400', 'text-slate-500');
  s = s.replaceAll('text-gray-500', 'text-slate-400');

  // 7. Recharts styles
  s = s.replaceAll('stroke="#131d35"', 'stroke="#e2e8f0"');
  s = s.replaceAll('stroke="#1e293b"', 'stroke="#e2e8f0"');
  s = s.replaceAll('stroke="#18264e"', 'stroke="#e2e8f0"');
  s = s.replaceAll("contentStyle={{ backgroundColor: '#0d1527', borderColor: '#131d35', borderRadius: '10px' }}", "contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}");
  s = s.replaceAll("contentStyle={{ backgroundColor: '#0b1329', borderColor: '#131d35', borderRadius: '10px' }}", "contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}");

  return s;
}

const allFiles = getFiles('apps/frontend/src/pages');
let processedCount = 0;

for (const file of allFiles) {
  const original = fs.readFileSync(file, 'utf8');
  const modified = refactorCode(original);
  if (original !== modified) {
    fs.writeFileSync(file, modified, 'utf8');
    processedCount++;
    console.log(`Updated: ${path.relative('apps/frontend/src', file)}`);
  }
}

console.log(`\nAll done! Successfully updated ${processedCount} files to 100% Light Theme!`);
