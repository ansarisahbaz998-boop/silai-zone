import fs from 'fs';
import path from 'path';

const TARGET_DIR = path.resolve('public/images/categories');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

async function searchDDGImages(query) {
  try {
    const req = await fetch(`https://duckduckgo.com/?q=${encodeURIComponent(query)}&iax=images&ia=images`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const text = await req.text();
    const vqdMatch = text.match(/vqd=([0-9-]+)/) || text.match(/vqd="([^"]+)"/);
    if (!vqdMatch) return [];
    const vqd = vqdMatch[1];
    const imgRes = await fetch(`https://duckduckgo.com/i.js?l=wt-wt&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}`, {
      headers: {
        'Referer': 'https://duckduckgo.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const data = await imgRes.json();
    return data.results || [];
  } catch (err) {
    console.error(`Error searching for ${query}:`, err.message);
    return [];
  }
}

async function downloadBestImage(categoryKey, queryList, fallbackFilename) {
  console.log(`\n--- Fetching image for ${categoryKey} ---`);
  for (const query of queryList) {
    const results = await searchDDGImages(query);
    console.log(`Query "${query}" returned ${results.length} results.`);
    for (const item of results.slice(0, 10)) {
      const imgUrl = item.image;
      if (!imgUrl || !imgUrl.startsWith('http')) continue;
      // Skip problematic domains
      if (imgUrl.includes('indiamart.com') || imgUrl.includes('ebay') || imgUrl.includes('aliexpress')) continue;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(imgUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
          }
        });
        clearTimeout(timeout);
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && (contentType.includes('image/jpeg') || contentType.includes('image/png') || contentType.includes('image/webp'))) {
          const buffer = Buffer.from(await res.arrayBuffer());
          if (buffer.length > 25000) { // at least 25KB for good visual quality
            const targetPath = path.join(TARGET_DIR, `${categoryKey}.jpg`);
            fs.writeFileSync(targetPath, buffer);
            console.log(`✓ Successfully downloaded ${categoryKey}.jpg from: ${imgUrl} (${buffer.length} bytes)`);
            return targetPath;
          }
        }
      } catch (e) {
        // try next
      }
    }
  }
  console.warn(`Could not download image for ${categoryKey}`);
  return null;
}

const CATEGORY_SEARCHES = {
  'salwar-suit': [
    'punjabi salwar suit boutique cotton silk',
    'indian salwar suit kurti with salwar dupatta',
    'designer boutique salwar kameez suit'
  ],
  'top': [
    'ladies designer fancy kurti tunic top boutique',
    'women stylish ethnic top kurti tailored',
    'ladies fancy short kurti top modern design'
  ],
  'lehenga-choli': [
    'indian wedding bridal lehenga choli flared boutique',
    'designer lehenga choli with dupatta heavy gher',
    'festive party wear lehenga choli'
  ],
  'astar-blouse': [
    'indian saree blouse design simple astar round neck',
    'cotton lined astar saree blouse tailored boutique',
    'traditional saree blouse back neck piping'
  ],
  'princess-cut-blouse': [
    'princess cut blouse design designer latkan',
    'padded princess cut saree blouse gold brocade',
    'designer princess cut blouse dori latkan'
  ],
  'saya': [
    'cotton saree petticoat saya 6 kali',
    'indian saree petticoat saya skirt pure cotton',
    'traditional cotton petticoat for saree'
  ],
  'pant-pajama': [
    'ladies cigarette pant for kurti suit ankle length',
    'women straight cigarette pants trouser with pocket',
    'ladies trouser pant pajama for suit'
  ],
  'plazo': [
    'designer flared palazzo pants plazo suit',
    'wide leg flared plazo pants with lace border',
    'umbrella cut palazzo pants ladies'
  ],
  'garara': [
    'traditional garara suit knee pleated flare',
    'sharara garara suit design wedding festive',
    'lucknowi garara suit knee gathered'
  ]
};

async function main() {
  for (const [key, queries] of Object.entries(CATEGORY_SEARCHES)) {
    await downloadBestImage(key, queries);
  }
  console.log('\nAll categories processed!');
}

main();
