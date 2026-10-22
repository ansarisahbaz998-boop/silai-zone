import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPng(width, height, colorHex) {
  // Parse hex color
  const r = parseInt(colorHex.slice(1, 3), 16);
  const g = parseInt(colorHex.slice(3, 5), 16);
  const b = parseInt(colorHex.slice(5, 7), 16);

  // PNG header signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth 8
  ihdr.writeUInt8(2, 9); // color type 2 (Truecolor, RGB)
  ihdr.writeUInt8(0, 10); // compression method 0
  ihdr.writeUInt8(0, 11); // filter method 0
  ihdr.writeUInt8(0, 12); // interlace method 0

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // Raw image data with scanline filter byte (0)
  const rowSize = 1 + width * 3;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type None
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 3;
      // create subtle gold embroidery border effect
      const isBorder = (x < 12 || x > width - 13 || y < 12 || y > height - 13);
      const isInnerBorder = (x > 18 && x < 22) || (x > width - 23 && x < width - 19) ||
                            (y > 18 && y < 22) || (y > height - 23 && y < height - 19);
      if (isBorder || isInnerBorder) {
        rawData[pxOffset] = 234; // Gold R
        rawData[pxOffset + 1] = 179; // Gold G
        rawData[pxOffset + 2] = 8; // Gold B
      } else {
        rawData[pxOffset] = r;
        rawData[pxOffset + 1] = g;
        rawData[pxOffset + 2] = b;
      }
    }
  }

  const compressed = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const length = data.length;
  const chunk = Buffer.alloc(8 + length + 4);
  chunk.writeUInt32BE(length, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);

  const crc = crc32(Buffer.concat([Buffer.from(type, 'ascii'), data]));
  chunk.writeInt32BE(crc, 8 + length);
  return chunk;
}

// Standard CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ buf[i]) & 0xff];
  }
  return crc ^ -1;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write PNGs
const primaryHex = '#831843'; // Rich magenta / velvet boutique brand
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, primaryHex));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, primaryHex));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, primaryHex));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, primaryHex));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, primaryHex));

console.log('Successfully generated compliant PWA PNG icons!');
