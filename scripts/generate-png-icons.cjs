const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function createPng(width, height, drawFn) {
  const crcTable = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    crcTable[n] = c >>> 0;
  }
  function crc32(buf) {
    let c = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) {
      c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
  }

  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const crcBuf = Buffer.alloc(4);
    const toCrc = Buffer.concat([typeBuf, data]);
    crcBuf.writeUInt32BE(crc32(toCrc), 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = makeChunk("IHDR", ihdrData);

  const raw = Buffer.alloc(height * (1 + width * 4));
  let pos = 0;
  for (let y = 0; y < height; y++) {
    raw[pos++] = 0; // Filter 0
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = drawFn(x, y, width, height);
      raw[pos++] = r;
      raw[pos++] = g;
      raw[pos++] = b;
      raw[pos++] = a;
    }
  }

  const compressed = zlib.deflateSync(raw);
  const idat = makeChunk("IDAT", compressed);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Icon renderer with rounded emerald background and credit card / coin motif
function drawBrandIcon(x, y, width, height, isMaskable = false) {
  const nx = x / width;
  const ny = y / height;

  // Background color gradient: #059669 to #064e3b
  const bgR = Math.round(5 + (6 - 5) * ny);
  const bgG = Math.round(150 + (78 - 150) * ny);
  const bgB = Math.round(105 + (59 - 105) * ny);

  if (!isMaskable) {
    // Check rounded corner distance
    const radius = 0.22;
    let distCorner = 0;
    if (nx < radius && ny < radius) distCorner = Math.hypot(nx - radius, ny - radius);
    else if (nx > 1 - radius && ny < radius) distCorner = Math.hypot(nx - (1 - radius), ny - radius);
    else if (nx < radius && ny > 1 - radius) distCorner = Math.hypot(nx - radius, ny - (1 - radius));
    else if (nx > 1 - radius && ny > 1 - radius) distCorner = Math.hypot(nx - (1 - radius), ny - (1 - radius));

    if (distCorner > radius) {
      return [0, 0, 0, 0]; // Transparent outside rounded corner
    }
  }

  // Safe-zone card dimensions
  const scale = isMaskable ? 0.72 : 0.82;
  const cx = 0.5;
  const cy = 0.5;
  
  const cardW = scale * 0.78;
  const cardH = scale * 0.52;
  const cardLeft = cx - cardW / 2;
  const cardRight = cx + cardW / 2;
  const cardTop = cy - cardH / 2;
  const cardBottom = cy + cardH / 2;

  // Check if inside card
  if (nx >= cardLeft && nx <= cardRight && ny >= cardTop && ny <= cardBottom) {
    // Card magnetic stripe
    const stripeTop = cardTop + cardH * 0.2;
    const stripeBottom = cardTop + cardH * 0.38;
    if (ny >= stripeTop && ny <= stripeBottom) {
      return [15, 23, 42, 255]; // Dark stripe #0f172a
    }

    // Chip emblem
    const chipL = cardLeft + cardW * 0.12;
    const chipR = chipL + cardW * 0.18;
    const chipT = cardTop + cardH * 0.55;
    const chipB = chipT + cardH * 0.26;
    if (nx >= chipL && nx <= chipR && ny >= chipT && ny <= chipB) {
      return [245, 158, 11, 255]; // Gold #f59e0b
    }

    // Coin emblem
    const coinCenterX = cardRight - cardW * 0.22;
    const coinCenterY = cardTop + cardH * 0.68;
    const coinRadius = cardH * 0.22;
    const distToCoin = Math.hypot(nx - coinCenterX, ny - coinCenterY);
    if (distToCoin <= coinRadius) {
      if (distToCoin > coinRadius * 0.8) {
        return [217, 119, 6, 255]; // Gold border
      }
      return [251, 191, 36, 255]; // Gold body
    }

    return [255, 255, 255, 255]; // Card white body
  }

  return [bgR, bgG, bgB, 255];
}

const outDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log("Generating PWA PNG icons in", outDir);

// 192x192
const pwa192 = createPng(192, 192, (x, y, w, h) => drawBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), pwa192);

// 512x512
const pwa512 = createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), pwa512);

// 512x512 Maskable
const pwaMaskable = createPng(512, 512, (x, y, w, h) => drawBrandIcon(x, y, w, h, true));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), pwaMaskable);

// Apple Touch Icon (180x180)
const appleIcon = createPng(180, 180, (x, y, w, h) => drawBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), appleIcon);

// Favicon PNG (32x32)
const favIcon = createPng(32, 32, (x, y, w, h) => drawBrandIcon(x, y, w, h, false));
fs.writeFileSync(path.join(outDir, 'favicon.png'), favIcon);

console.log("All PWA icons generated successfully!");
