const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function generatePNG(width, height) {
    // 1. Calculate CRC32
    const crcTable = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            if (c & 1) c = 0xedb88320 ^ (c >>> 1);
            else c = c >>> 1;
        }
        crcTable[n] = c;
    }

    function crc32(buf) {
        let crc = 0xffffffff;
        for (let i = 0; i < buf.length; i++) {
            crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    function makeChunk(type, data) {
        const len = Buffer.alloc(4);
        len.writeUInt32BE(data.length, 0);

        const typeBuf = Buffer.from(type, 'ascii');
        const crcBuf = Buffer.alloc(4);
        const crcVal = crc32(Buffer.concat([typeBuf, data]));
        crcBuf.writeUInt32BE(crcVal, 0);

        return Buffer.concat([len, typeBuf, data, crcBuf]);
    }

    // Header
    const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

    // IHDR
    const ihdrData = Buffer.alloc(13);
    ihdrData.writeUInt32BE(width, 0);
    ihdrData.writeUInt32BE(height, 4);
    ihdrData[8] = 8; // 8 bit
    ihdrData[9] = 6; // RGBA
    ihdrData[10] = 0; // Compression
    ihdrData[11] = 0; // Filter
    ihdrData[12] = 0; // Interlace
    const ihdr = makeChunk('IHDR', ihdrData);

    // Draw RGBA pixel buffer
    const rawLines = [];
    const radius = width / 2;
    const innerRadius = radius * 0.88;

    for (let y = 0; y < height; y++) {
        const line = Buffer.alloc(1 + width * 4);
        line[0] = 0; // Filter type 0 (None)

        for (let x = 0; x < width; x++) {
            const idx = 1 + x * 4;
            const dx = x - radius;
            const dy = y - radius;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Dark navy background (#0F172A)
            let r = 0x0F, g = 0x17, b = 0x2A, a = 0xFF;

            // Outer circle border gradient (#0284c7 to #38bdf8)
            if (dist <= radius && dist >= innerRadius) {
                r = 0x02; g = 0x84; b = 0xC7;
            } else if (dist < innerRadius) {
                // Inner card bg (#1E293B)
                r = 0x1E; g = 0x29; b = 0x3B;

                // Draw "M M" Letter pixel pattern in the center
                const cx = (x - radius) / radius;
                const cy = (y - radius) / radius;

                // Left 'M' (pinkish red #f43f5e)
                const leftM = (cx >= -0.55 && cx <= -0.1) && (cy >= -0.4 && cy <= 0.4) &&
                    (Math.abs(cx - (-0.5)) < 0.1 || Math.abs(cx - (-0.15)) < 0.1 || (cy < 0 && Math.abs(cx - (-0.325)) < 0.18 + cy * 0.2));

                // Right 'M' (purple #a855f7)
                const rightM = (cx >= 0.1 && cx <= 0.55) && (cy >= -0.4 && cy <= 0.4) &&
                    (Math.abs(cx - 0.15) < 0.1 || Math.abs(cx - 0.5) < 0.1 || (cy < 0 && Math.abs(cx - 0.325) < 0.18 + cy * 0.2));

                if (leftM) {
                    r = 0xF4; g = 0x3F; b = 0x5E;
                } else if (rightM) {
                    r = 0xA8; g = 0x55; b = 0xF7;
                }
            }

            line[idx] = r;
            line[idx + 1] = g;
            line[idx + 2] = b;
            line[idx + 3] = a;
        }
        rawLines.push(line);
    }

    const uncompressed = Buffer.concat(rawLines);
    const compressed = zlib.deflateSync(uncompressed);
    const idat = makeChunk('IDAT', compressed);
    const iend = makeChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdr, idat, iend]);
}

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

console.log('🖼️ Generating PWA Icons...');

const icon192 = generatePNG(192, 192);
const icon512 = generatePNG(512, 512);

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), icon192);
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), icon512);
fs.writeFileSync(path.join(publicDir, 'manifest-icon.png'), icon512);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), icon192);

console.log('✅ All PWA PNG icons generated successfully!');
