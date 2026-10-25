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

// 1. Fix Recharts Tooltip dark style across all files
const allFiles = getFiles('apps/frontend/src/pages');
for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Recharts tooltip
  if (content.includes("background: '#0b1329'") || content.includes("backgroundColor: '#1e293b'")) {
    content = content.replaceAll("background: '#0b1329', border: '1px solid #131d35'", "backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'");
    content = content.replaceAll("backgroundColor: '#1e293b', border: 'none'", "backgroundColor: '#ffffff', border: '1px solid #e2e8f0', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'");
    changed = true;
  }

  // dark:bg-slate-900 and dark: classes removal
  if (content.includes('dark:bg-slate-900') || content.includes('dark:border-slate-700')) {
    content = content.replaceAll('dark:bg-slate-900/50', '');
    content = content.replaceAll('dark:bg-slate-900/60', '');
    content = content.replaceAll('dark:bg-slate-900', '');
    content = content.replaceAll('dark:border-slate-700', '');
    content = content.replaceAll('dark:text-white', '');
    content = content.replaceAll('dark:text-slate-100', '');
    content = content.replaceAll('dark:text-slate-300', '');
    content = content.replaceAll('dark:text-slate-400', '');
    content = content.replaceAll('dark:text-slate-500', '');
    content = content.replaceAll('dark:bg-slate-800', '');
    changed = true;
  }

  // Any remaining stroke="#0b1329"
  if (content.includes('stroke="#0b1329"')) {
    content = content.replaceAll('stroke="#0b1329"', 'stroke="#ffffff"');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed tooltips/dark utilities in:', path.basename(file));
  }
}

// 2. Specific fix for admin/sales.tsx
const adminSalesPath = path.resolve('apps/frontend/src/pages/admin/sales.tsx');
if (fs.existsSync(adminSalesPath)) {
  let c = fs.readFileSync(adminSalesPath, 'utf8');
  c = c.replaceAll('bg-slate-900 border border-slate-800', 'bg-white border border-slate-200');
  c = c.replaceAll('bg-slate-900 border border-slate-700', 'bg-slate-50 border border-slate-200');
  c = c.replaceAll('bg-slate-900 border border-amber-500/30', 'bg-white border border-amber-200');
  c = c.replaceAll('bg-slate-900 border border-rose-500/30', 'bg-white border border-rose-200');
  c = c.replaceAll('bg-slate-900 border border-emerald-500/30', 'bg-white border border-emerald-200');
  c = c.replaceAll('bg-slate-900 border border-blue-500/30', 'bg-white border border-blue-200');
  c = c.replaceAll('bg-slate-900', 'bg-white');
  c = c.replaceAll('border-slate-800', 'border-slate-200');
  c = c.replaceAll('border-slate-700', 'border-slate-200');
  c = c.replaceAll('text-slate-200', 'text-slate-800');
  fs.writeFileSync(adminSalesPath, c, 'utf8');
  console.log('Fixed admin/sales.tsx');
}

// 3. Specific fix for infrastruktur/map.tsx
const mapPath = path.resolve('apps/frontend/src/pages/infrastruktur/map.tsx');
if (fs.existsSync(mapPath)) {
  let c = fs.readFileSync(mapPath, 'utf8');
  c = c.replaceAll('bg-slate-900/50 border border-slate-800', 'bg-white border border-slate-200 shadow-2xs');
  c = c.replaceAll('bg-slate-900/40 border border-slate-800', 'bg-white border border-slate-200 shadow-2xs');
  c = c.replaceAll('bg-slate-900/30 border border-slate-800', 'bg-white border border-slate-200 shadow-2xs');
  c = c.replaceAll('flex bg-slate-900 border border-slate-800', 'flex bg-slate-100 border border-slate-200');
  c = c.replaceAll('bg-slate-900/60', 'bg-slate-100');
  c = c.replaceAll('hover:bg-slate-900/20', 'hover:bg-slate-50');
  c = c.replaceAll('hover:bg-slate-900', 'hover:bg-slate-100');
  c = c.replaceAll('bg-slate-900 p-2 rounded-lg border border-slate-800', 'bg-slate-50 p-2 rounded-lg border border-slate-200');
  c = c.replaceAll('bg-slate-900 border border-slate-800', 'bg-slate-50 border border-slate-200');
  c = c.replaceAll('border-slate-800', 'border-slate-200');
  c = c.replaceAll('bg-slate-900', 'bg-white');
  fs.writeFileSync(mapPath, c, 'utf8');
  console.log('Fixed infrastruktur/map.tsx');
}

// 4. Specific fix for sales/daftar.tsx
const salesDaftarPath = path.resolve('apps/frontend/src/pages/sales/daftar.tsx');
if (fs.existsSync(salesDaftarPath)) {
  let c = fs.readFileSync(salesDaftarPath, 'utf8');
  c = c.replaceAll('bg-slate-900/90 border border-emerald-500/30', 'bg-white border border-emerald-200');
  c = c.replaceAll('bg-slate-900/80 border border-slate-800', 'bg-white border border-slate-200');
  c = c.replaceAll('bg-slate-900', 'bg-white');
  c = c.replaceAll('border-slate-800', 'border-slate-200');
  fs.writeFileSync(salesDaftarPath, c, 'utf8');
  console.log('Fixed sales/daftar.tsx');
}

// 5. Specific fix for finance/laba-rugi.tsx
const labaRugiPath = path.resolve('apps/frontend/src/pages/finance/laba-rugi.tsx');
if (fs.existsSync(labaRugiPath)) {
  let c = fs.readFileSync(labaRugiPath, 'utf8');
  c = c.replaceAll('w-full bg-slate-900 rounded-full h-2.5', 'w-full bg-slate-100 rounded-full h-2.5');
  fs.writeFileSync(labaRugiPath, c, 'utf8');
  console.log('Fixed finance/laba-rugi.tsx');
}

// 6. Specific fix for modal backdrops (convert bg-slate-900/50 backdrop to bg-black/40)
for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('bg-slate-900/50 backdrop-blur-xs') || content.includes('bg-slate-900/50 backdrop-blur-sm')) {
    content = content.replaceAll('bg-slate-900/50 backdrop-blur-xs', 'bg-black/30 backdrop-blur-xs');
    content = content.replaceAll('bg-slate-900/50 backdrop-blur-sm', 'bg-black/30 backdrop-blur-sm');
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed modal backdrop in:', path.basename(file));
  }
}

console.log('All remaining cleanups completed!');
