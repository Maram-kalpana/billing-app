const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'assets', 'products');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const palette = {
  apple: { bg: '#fef2f2', accent: '#dc2626' },
  banana: { bg: '#fef3c7', accent: '#ca8a04' },
  tomato: { bg: '#fff7ed', accent: '#dc2626' },
  potato: { bg: '#fef3c7', accent: '#a16207' },
  rice: { bg: '#f5f5f4', accent: '#92400e' },
  eggs: { bg: '#fefce8', accent: '#a16207' },
  milk: { bg: '#eff6ff', accent: '#2563eb' },
  bread: { bg: '#fff7ed', accent: '#c2410c' },
  chicken: { bg: '#fef2f2', accent: '#991b1b' },
  fish: { bg: '#eff6ff', accent: '#1d4ed8' },
  oil: { bg: '#f5f3ff', accent: '#7c3aed' },
  sugar: { bg: '#fefce8', accent: '#d97706' },
  salt: { bg: '#f8fafc', accent: '#64748b' },
  soap: { bg: '#fdf2f8', accent: '#db2777' },
  shampoo: { bg: '#ecfeff', accent: '#0891b2' },
  biscuit: { bg: '#fff7ed', accent: '#b45309' },
  juice: { bg: '#f0fdf4', accent: '#16a34a' },
  soda: { bg: '#fef2f2', accent: '#ef4444' },
};

const drawProduct = async (name, { bg, accent }) => {
  const svg = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="72" fill="${bg}"/>
    <circle cx="256" cy="256" r="180" fill="white" opacity="0.45"/>
    <ellipse cx="256" cy="300" rx="120" ry="88" fill="${accent}" opacity="0.16"/>
    <path d="M176 192c0-43 34-78 80-78h8c46 0 80 35 80 78v8c0 13-10 23-23 23h-122c-13 0-23-10-23-23v-8Z" fill="${accent}" opacity="0.92"/>
    <path d="M176 214h160c18 0 33 14 33 32v76c0 31-25 56-56 56H199c-31 0-56-25-56-56v-76c0-18 15-32 33-32Z" fill="white" opacity="0.95"/>
    <rect x="192" y="230" width="128" height="90" rx="24" fill="${accent}" opacity="0.96"/>
    <rect x="214" y="160" width="84" height="36" rx="18" fill="white" opacity="0.7"/>
    <path d="M220 342c18 16 54 16 72 0" stroke="${accent}" stroke-width="12" stroke-linecap="round" fill="none" opacity="0.7"/>
    <text x="256" y="428" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="600" fill="#111827">${name}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, `${name}.png`));
};

(async () => {
  for (const [key, value] of Object.entries(palette)) {
    await drawProduct(key, value);
  }
  console.log('Generated assets:', Object.keys(palette).join(', '));
})();
