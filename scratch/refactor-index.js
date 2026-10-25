const fs = require('fs');
const path = require('path');

const filePath = path.resolve('apps/frontend/src/pages/index.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replace dark container & loading
content = content.replace(
  'min-h-screen bg-[#080d19] flex items-center justify-center',
  'min-h-screen bg-slate-50 flex items-center justify-center'
);

content = content.replace(
  'min-h-screen bg-[#080d19] text-gray-200 p-4 md:p-6 space-y-6 overflow-hidden',
  'min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 space-y-6'
);

// Header section
content = content.replace(
  'border-b border-[#131d35] pb-5',
  'border-b border-slate-200 pb-5'
);
content = content.replace(
  '<h1 className="text-2xl font-bold text-white flex items-center gap-2">',
  '<h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">'
);
content = content.replace(
  '<span className="text-blue-400 font-extrabold">{user?.name || \'Agus Dwi Rianto\'}</span>',
  '<span className="text-blue-600 font-extrabold">{user?.name || \'Agus Dwi Rianto\'}</span>'
);
content = content.replace(
  '<p className="text-xs text-gray-450 text-gray-400">Semoga harimu menyenangkan!</p>',
  '<p className="text-xs text-slate-500">Semoga harimu menyenangkan!</p>'
);

// Clock & Status widget
content = content.replace(
  'bg-[#0d1527] border border-[#1e293b] rounded-xl px-4 py-2 text-xs font-semibold text-gray-300',
  'bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs'
);
content = content.replace(
  '<Calendar size={14} className="text-blue-400" />',
  '<Calendar size={14} className="text-blue-600" />'
);
content = content.replace(
  '<span className="text-gray-500">|</span>',
  '<span className="text-slate-300">|</span>'
);
content = content.replace(
  'bg-[#0d1527] border border-[#1e293b] rounded-xl px-4 py-2 text-xs font-semibold',
  'bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold shadow-xs'
);
content = content.replace(
  '<span className="text-gray-400">Status Sistem:</span>',
  '<span className="text-slate-500">Status Sistem:</span>'
);
content = content.replace(
  '<span className="text-green-500 font-bold">Normal</span>',
  '<span className="text-emerald-600 font-bold">Normal</span>'
);

// Main metrics grid cards
content = content.replace(
  'bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-blue-500/30 transition duration-300 flex flex-col justify-between',
  'bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-xs transition duration-200 flex flex-col justify-between shadow-xs'
);
content = content.replace(
  '<p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Total Customer</p>',
  '<p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Customer</p>'
);
content = content.replace(
  '<p className="text-3xl font-extrabold text-white mt-1.5">{totalCustomers.toLocaleString(\'id-ID\')}</p>',
  '<p className="text-3xl font-extrabold text-slate-900 mt-1.5">{totalCustomers.toLocaleString(\'id-ID\')}</p>'
);
content = content.replace(
  'p-2.5 bg-blue-500/10 text-blue-400 rounded-xl',
  'p-2.5 bg-blue-50 text-blue-600 rounded-xl'
);
content = content.replace(
  'grid grid-cols-4 gap-2 border-t border-[#131d35] pt-4 mt-4 text-[10px]',
  'grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 mt-4 text-[10px]'
);

// Card 2
content = content.replace(
  'bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-emerald-500/30 transition duration-300 flex flex-col justify-between',
  'bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-xs transition duration-200 flex flex-col justify-between shadow-xs'
);
content = content.replace(
  '<p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Total Invoice</p>',
  '<p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Invoice</p>'
);
content = content.replace(
  '<p className="text-3xl font-extrabold text-white mt-1.5">{totalInvoicesCount.toLocaleString(\'id-ID\')}</p>',
  '<p className="text-3xl font-extrabold text-slate-900 mt-1.5">{totalInvoicesCount.toLocaleString(\'id-ID\')}</p>'
);
content = content.replace(
  'p-2.5 bg-[#10b981]/10 text-[#10b981] rounded-xl',
  'p-2.5 bg-emerald-50 text-emerald-600 rounded-xl'
);

// Card 3
content = content.replace(
  'bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-indigo-500/30 transition duration-300 flex flex-col justify-between',
  'bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-300 hover:shadow-xs transition duration-200 flex flex-col justify-between shadow-xs'
);
content = content.replace(
  '<p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Total Revenue (Bulan Ini)</p>',
  '<p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Revenue (Bulan Ini)</p>'
);
content = content.replace(
  '<p className="text-2xl font-extrabold text-white mt-2">Rp {totalRevenueBulanIni.toLocaleString(\'id-ID\')}</p>',
  '<p className="text-2xl font-extrabold text-slate-900 mt-2">Rp {totalRevenueBulanIni.toLocaleString(\'id-ID\')}</p>'
);
content = content.replace(
  'p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl',
  'p-2.5 bg-indigo-50 text-indigo-600 rounded-xl'
);
content = content.replace(
  'grid grid-cols-3 gap-2 border-t border-[#131d35] pt-4 mt-4 text-[10px]',
  'grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 mt-4 text-[10px]'
);
content = content.replaceAll(
  '<p className="text-xs font-bold text-white mt-0.5">',
  '<p className="text-xs font-bold text-slate-800 mt-0.5">'
);

// Card 4
content = content.replace(
  'bg-[#0b1329] border border-[#131d35] rounded-2xl p-5 hover:border-red-500/30 transition duration-300 flex flex-col justify-between',
  'bg-white border border-slate-200 rounded-2xl p-5 hover:border-rose-300 hover:shadow-xs transition duration-200 flex flex-col justify-between shadow-xs'
);
content = content.replace(
  '<p className="text-xs text-gray-450 font-bold uppercase tracking-wider text-gray-400">Outstanding Balance</p>',
  '<p className="text-xs font-bold uppercase tracking-wider text-slate-500">Outstanding Balance</p>'
);
content = content.replace(
  '<p className="text-2xl font-extrabold text-white mt-2">Rp 125.430.000</p>',
  '<p className="text-2xl font-extrabold text-slate-900 mt-2">Rp 125.430.000</p>'
);
content = content.replace(
  'p-2.5 bg-red-500/10 text-red-400 rounded-xl',
  'p-2.5 bg-rose-50 text-rose-600 rounded-xl'
);

// Generic card replacement for all remaining bg-[#0b1329]
content = content.replaceAll(
  'bg-[#0b1329] border border-[#131d35] rounded-2xl p-6',
  'bg-white border border-slate-200 rounded-2xl p-6 shadow-xs'
);

// In-card headings and descriptions
content = content.replaceAll(
  '<h2 className="text-base font-bold text-white">',
  '<h2 className="text-base font-bold text-slate-900">'
);
content = content.replaceAll(
  '<h2 className="text-base font-bold text-white mb-1">',
  '<h2 className="text-base font-bold text-slate-900 mb-1">'
);

// Chart select dropdowns
content = content.replaceAll(
  'bg-[#0d1527] border border-[#1e293b] rounded-lg px-3 py-1.5 text-xs text-gray-300',
  'bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700'
);
content = content.replaceAll(
  'bg-[#0d1527] border border-[#1e293b] rounded-lg px-2 py-1 text-[11px] text-gray-300',
  'bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] text-slate-700'
);

// Chart tooltips and grids
content = content.replaceAll(
  'stroke="#131d35"',
  'stroke="#e2e8f0"'
);
content = content.replaceAll(
  "contentStyle={{ backgroundColor: '#0d1527', borderColor: '#131d35', borderRadius: '10px' }}",
  "contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}"
);
content = content.replaceAll(
  "labelStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}",
  "labelStyle={{ color: '#0f172a', fontSize: '12px', fontWeight: 'bold' }}"
);
content = content.replaceAll(
  "labelStyle={{ color: '#fff', fontSize: '11px' }}",
  "labelStyle={{ color: '#0f172a', fontSize: '11px' }}"
);

// Pie chart center text
content = content.replace(
  '<p className="text-2xl font-black text-white">{totalInvoicesCount.toLocaleString(\'id-ID\')}</p>',
  '<p className="text-2xl font-black text-slate-900">{totalInvoicesCount.toLocaleString(\'id-ID\')}</p>'
);
content = content.replace(
  '<p className="text-xl font-black text-white">3,656</p>',
  '<p className="text-xl font-black text-slate-900">3,656</p>'
);

// List items text-white -> text-slate-800
content = content.replaceAll(
  '<span className="font-bold text-white">',
  '<span className="font-bold text-slate-800">'
);
content = content.replaceAll(
  '<span className="font-extrabold text-white">',
  '<span className="font-extrabold text-slate-800">'
);
content = content.replaceAll(
  '<span className="font-semibold text-gray-250 text-white">',
  '<span className="font-semibold text-slate-800">'
);
content = content.replaceAll(
  '<span className="text-white">',
  '<span className="text-slate-800">'
);

// Top 5 rank badge
content = content.replace(
  "'bg-[#131d35] text-gray-400'",
  "'bg-slate-100 text-slate-600'"
);

// Progress bar backgrounds
content = content.replaceAll(
  'w-full bg-[#131d35] h-1.5 rounded-full overflow-hidden',
  'w-full bg-slate-100 h-1.5 rounded-full overflow-hidden'
);
content = content.replaceAll(
  'w-full bg-[#131d35] h-2 rounded-full overflow-hidden',
  'w-full bg-slate-100 h-2 rounded-full overflow-hidden'
);

// Customer status rings
content = content.replaceAll(
  '<div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">',
  '<div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-800">'
);
content = content.replaceAll(
  '<p className="text-xs font-bold text-white mt-1.5">',
  '<p className="text-xs font-bold text-slate-800 mt-1.5">'
);

// Tables
content = content.replaceAll(
  '<tr className="border-b border-[#131d35] text-gray-500 font-bold">',
  '<tr className="border-b border-slate-200 text-slate-500 font-bold">'
);
content = content.replaceAll(
  '<tbody className="divide-y divide-[#131d35]">',
  '<tbody className="divide-y divide-slate-100">'
);
content = content.replaceAll(
  '<tr key={inv.id} className="text-white hover:bg-white/5 transition-colors">',
  '<tr key={inv.id} className="text-slate-800 hover:bg-slate-50 transition-colors">'
);
content = content.replaceAll(
  'text-blue-400 font-bold">{inv.id.substring(4)}',
  'text-blue-600 font-bold">{inv.id.substring(4)}'
);

// Overdue cards
content = content.replaceAll(
  'p-3 bg-[#0d1527] border border-[#131d35] rounded-xl text-center',
  'p-3 bg-slate-50 border border-slate-200 rounded-xl text-center'
);

// Activity Timeline
content = content.replace(
  'border-l border-[#1e293b] ml-4 pl-6 space-y-4 text-xs',
  'border-l border-slate-200 ml-4 pl-6 space-y-4 text-xs'
);
content = content.replace(
  'border-2 border-[#0b1329]',
  'border-2 border-white'
);
content = content.replaceAll(
  '<span className="text-gray-300 font-medium">{activity.text}</span>',
  '<span className="text-slate-700 font-medium">{activity.text}</span>'
);

// Action links text-blue-400 -> text-blue-600
content = content.replaceAll(
  'text-blue-400 font-semibold hover:underline',
  'text-blue-600 font-semibold hover:underline'
);

// Quick action buttons light colors
content = content.replace(
  "bg: 'bg-blue-500/10 text-blue-400 border border-blue-500/20'",
  "bg: 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'"
);
content = content.replace(
  "bg: 'bg-green-500/10 text-green-500 border border-green-500/20'",
  "bg: 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'"
);
content = content.replace(
  "bg: 'bg-amber-500/10 text-amber-500 border border-amber-500/20'",
  "bg: 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100'"
);
content = content.replace(
  "bg: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'",
  "bg: 'bg-teal-50 text-teal-600 border border-teal-200 hover:bg-teal-100'"
);
content = content.replace(
  "bg: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'",
  "bg: 'bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100'"
);
content = content.replace(
  "bg: 'bg-teal-500/10 text-teal-400 border border-teal-500/20'",
  "bg: 'bg-cyan-50 text-cyan-600 border border-cyan-200 hover:bg-cyan-100'"
);
content = content.replace(
  "bg: 'bg-sky-500/10 text-sky-400 border border-sky-500/20'",
  "bg: 'bg-sky-50 text-sky-600 border border-sky-200 hover:bg-sky-100'"
);
content = content.replace(
  "bg: 'bg-rose-500/10 text-rose-455 border border-rose-500/20 text-rose-400'",
  "bg: 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100'"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully refactored index.tsx to Light Theme!');
