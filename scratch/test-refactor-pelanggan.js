const fs = require('fs');
const path = require('path');

function refactorContent(content) {
  let res = content;

  // 1. Canvases & Outer Containers
  res = res.replaceAll('min-h-screen bg-[#080d19] text-gray-200 p-4 md:p-6 space-y-6 overflow-hidden', 'min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 space-y-6');
  res = res.replaceAll('min-h-screen bg-[#070c19] text-gray-200 p-4 md:p-6 space-y-6', 'min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 space-y-6');
  res = res.replaceAll('min-h-screen bg-[#080d19] text-gray-200', 'min-h-screen bg-slate-50 text-slate-800');
  res = res.replaceAll('min-h-screen bg-[#070c19] text-gray-200', 'min-h-screen bg-slate-50 text-slate-800');
  res = res.replaceAll('min-h-screen bg-[#080d19]', 'min-h-screen bg-slate-50');
  res = res.replaceAll('min-h-screen bg-[#070c19]', 'min-h-screen bg-slate-50');
  res = res.replaceAll('bg-[#080d19]', 'bg-slate-50');
  res = res.replaceAll('bg-[#070c19]', 'bg-slate-50');
  res = res.replaceAll('bg-[#0a0f1d]', 'bg-slate-50');
  res = res.replaceAll('bg-[#020617]', 'bg-slate-50');

  // 2. Cards and Containers
  res = res.replaceAll('bg-[#0b1329] border border-[#131d35] rounded-2xl p-5', 'bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs');
  res = res.replaceAll('bg-[#0b1329] border border-[#131d35] rounded-2xl p-6', 'bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs');
  res = res.replaceAll('bg-[#0b1329] border border-[#131d35] rounded-2xl', 'bg-white border border-slate-200 rounded-2xl shadow-2xs');
  res = res.replaceAll('bg-[#0b1329] border border-[#131d35]', 'bg-white border border-slate-200');
  res = res.replaceAll('bg-[#0b1329]', 'bg-white');
  res = res.replaceAll('bg-[#0d1424]', 'bg-white');

  // 3. Inputs, Filters & Sub-panels
  res = res.replaceAll('bg-[#131d35]/50 border border-[#131d35]', 'bg-slate-50 border border-slate-200');
  res = res.replaceAll('bg-[#131d35]/35 hover:bg-[#131d35]/70 border border-[#131d35]', 'bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900');
  res = res.replaceAll('bg-[#131d35]/35', 'bg-slate-100');
  res = res.replaceAll('bg-[#131d35]/30', 'bg-slate-100');
  res = res.replaceAll('bg-[#131d35]/20', 'bg-slate-50');
  res = res.replaceAll('bg-[#131d35]', 'bg-slate-100');
  res = res.replaceAll('bg-[#121c38]', 'bg-slate-100');
  res = res.replaceAll('bg-[#0d1527] border border-[#1e293b]', 'bg-slate-50 border border-slate-200 text-slate-700');
  res = res.replaceAll('bg-[#0d1527] border border-[#131d35]', 'bg-slate-50 border border-slate-200 text-slate-700');
  res = res.replaceAll('bg-[#0d1527]', 'bg-slate-50');

  // 4. Borders and Dividers
  res = res.replaceAll('border-[#131d35]/30', 'border-slate-200/60');
  res = res.replaceAll('border-[#131d35]', 'border-slate-200');
  res = res.replaceAll('border-[#1e293b]', 'border-slate-200');
  res = res.replaceAll('border-[#172342]', 'border-slate-200');
  res = res.replaceAll('border-[#1F293D]', 'border-slate-200');
  res = res.replaceAll('border-[#243356]', 'border-slate-200');
  res = res.replaceAll('divide-[#131d35]', 'divide-slate-200');
  res = res.replaceAll('divide-[#1e293b]', 'divide-slate-200');

  // 5. Hovers
  res = res.replaceAll('hover:bg-[#121c38]', 'hover:bg-slate-50');
  res = res.replaceAll('hover:bg-[#131d35]', 'hover:bg-slate-100');
  res = res.replaceAll('hover:bg-[#172342]', 'hover:bg-slate-100');
  res = res.replaceAll('hover:bg-white/5', 'hover:bg-slate-50');
  res = res.replaceAll('hover:bg-white/10', 'hover:bg-slate-100');

  // 6. Headings and primary text in cards/tables
  res = res.replaceAll('<h1 className="text-2xl font-bold text-white', '<h1 className="text-2xl font-bold text-slate-900');
  res = res.replaceAll('<h2 className="text-base font-bold text-white', '<h2 className="text-base font-bold text-slate-900');
  res = res.replaceAll('<h3 className="text-sm font-bold text-white', '<h3 className="text-sm font-bold text-slate-900');
  res = res.replaceAll('<h4 className="font-bold text-white', '<h4 className="font-bold text-slate-900');
  res = res.replaceAll('font-black text-white', 'font-black text-slate-900');
  res = res.replaceAll('font-extrabold text-white', 'font-extrabold text-slate-900');
  res = res.replaceAll('font-bold text-white cursor-pointer hover:text-blue-400', 'font-bold text-slate-800 cursor-pointer hover:text-blue-600');
  res = res.replaceAll('font-bold text-white', 'font-bold text-slate-800');
  res = res.replaceAll('text-white focus:outline-none focus:border-blue-500', 'text-slate-800 focus:outline-none focus:border-blue-500');
  res = res.replaceAll('text-white placeholder-gray-500', 'text-slate-800 placeholder-slate-400');
  res = res.replaceAll('text-white tracking-tight', 'text-slate-900 tracking-tight');
  res = res.replaceAll('text-gray-400 hover:text-white', 'text-slate-500 hover:text-slate-900');
  res = res.replaceAll('text-gray-300 font-semibold', 'text-slate-700 font-semibold');
  res = res.replaceAll('text-gray-300', 'text-slate-600');
  res = res.replaceAll('text-gray-400', 'text-slate-500');
  res = res.replaceAll('text-gray-500', 'text-slate-400');

  // 7. Recharts styles
  res = res.replaceAll('stroke="#131d35"', 'stroke="#e2e8f0"');
  res = res.replaceAll('stroke="#1e293b"', 'stroke="#e2e8f0"');
  res = res.replaceAll("contentStyle={{ backgroundColor: '#0d1527', borderColor: '#131d35', borderRadius: '10px' }}", "contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}");
  res = res.replaceAll("contentStyle={{ backgroundColor: '#0b1329', borderColor: '#131d35', borderRadius: '10px' }}", "contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}");

  return res;
}

const targetPath = path.resolve('apps/frontend/src/pages/pelanggan.tsx');
const raw = fs.readFileSync(targetPath, 'utf8');
const processed = refactorContent(raw);
fs.writeFileSync(targetPath, processed, 'utf8');
console.log('Successfully refactored pelanggan.tsx');
