// Pure Node.js PNG icon generator for PWA assets without external dependencies
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function makePNG(width, height, drawFn) {
  // RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rgba[idx] = r;
      rgba[idx + 1] = g;
      rgba[idx + 2] = b;
      rgba[idx + 3] = a;
    }
  }

  // PNG raw image scanlines: filter byte 0 + scanline RGBA
  const lineSize = width * 4;
  const rawData = Buffer.alloc(height * (lineSize + 1));
  for (let y = 0; y < height; y++) {
    rawData[y * (lineSize + 1)] = 0; // Filter None
    rgba.copy(rawData, y * (lineSize + 1) + 1, y * lineSize, (y + 1) * lineSize);
  }

  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);

    let crc = 0xffffffff;
    const updateCrc = (buf) => {
      for (let i = 0; i < buf.length; i++) {
        let byte = buf[i];
        for (let j = 0; j < 8; j++) {
          const bit = (crc ^ byte) & 1;
          crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
          byte >>>= 1;
        }
      }
    };
    updateCrc(typeBuf);
    updateCrc(data);
    crc ^= 0xffffffff;
    crcBuf.writeInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', compressed);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Draw a beautiful golden star with warm amber background
function drawStarIcon(x, y, width, height, isMaskable = false) {
  const cx = width / 2;
  const cy = height / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background: Rounded soft amber/gold
  const maxR = width / 2;
  const cornerR = width * 0.25;
  
  // Calculate star shape distance
  const angle = Math.atan2(dy, dx) + Math.PI / 2;
  const points = 5;
  const step = Math.PI / points;
  let rStar = isMaskable ? width * 0.30 : width * 0.38;
  let rInner = rStar * 0.46;

  // Star polygon in polar coordinates
  const aMod = ((angle % (2 * step)) + (2 * step)) % (2 * step);
  const localA = aMod > step ? 2 * step - aMod : aMod;
  // Approximate star boundary
  const starRadius = rInner + (rStar - rInner) * (1 - localA / step);

  if (dist < starRadius) {
    // Star golden gradient
    const t = (y / height);
    const r = Math.round(251 - t * 25);
    const g = Math.round(191 - t * 40);
    const b = Math.round(36 - t * 20);
    return [r, g, b, 255];
  }

  // Background
  if (isMaskable) {
    // Full bleed warm amber gradient for maskable
    const t = y / height;
    const r = Math.round(254 - t * 10);
    const g = Math.round(243 - t * 25);
    const b = Math.round(199 - t * 40);
    return [r, g, b, 255];
  } else {
    // Squircle background
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const bound = width * 0.45;
    const inBox = (absX < bound && absY < bound);

    if (inBox) {
      const t = y / height;
      const r = Math.round(254 - t * 12);
      const g = Math.round(243 - t * 20);
      const b = Math.round(199 - t * 30);
      return [r, g, b, 255];
    }
    return [0, 0, 0, 0]; // transparent outer
  }
}

const pub = path.resolve('public');
if (!fs.existsSync(pub)) fs.mkdirSync(pub, { recursive: true });

fs.writeFileSync(path.join(pub, 'pwa-192x192.png'), makePNG(192, 192, (x, y, w, h) => drawStarIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(pub, 'pwa-512x512.png'), makePNG(512, 512, (x, y, w, h) => drawStarIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(pub, 'pwa-maskable-512x512.png'), makePNG(512, 512, (x, y, w, h) => drawStarIcon(x, y, w, h, true)));
fs.writeFileSync(path.join(pub, 'apple-touch-icon.png'), makePNG(180, 180, (x, y, w, h) => drawStarIcon(x, y, w, h, false)));
fs.writeFileSync(path.join(pub, 'favicon.ico'), makePNG(64, 64, (x, y, w, h) => drawStarIcon(x, y, w, h, false)));

console.log('Successfully generated all PWA PNG icons!');
