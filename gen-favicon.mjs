import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';

const INK = [0x0a, 0x0a, 0x0a];
const PAPER = [0xf4, 0xf4, 0xf2];

const TILE_R = 13;
const PILL = { cx: 37, cy: 32, hw: 15, hh: 10, r: 10, stroke: 6 };
const ARM = { ax: 11, ay: 32, bx: 22, by: 32, r: 3 };

const sdRoundRect = (px, py, { cx, cy, hw, hh, r }) => {
  const qx = Math.abs(px - cx) - (hw - r);
  const qy = Math.abs(py - cy) - (hh - r);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  return outside + Math.min(Math.max(qx, qy), 0) - r;
};
const sdSegment = (px, py, ax, ay, bx, by) => {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
};

function render(size) {
  const s = size / 64;
  const SS = 4;
  const buf = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let tile = 0, mark = 0;
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const dx = (x + (sx + 0.5) / SS) / s;
          const dy = (y + (sy + 0.5) / SS) / s;
          if (sdRoundRect(dx, dy, { cx: 32, cy: 32, hw: 32, hh: 32, r: TILE_R }) <= 0) tile++;
          const ring = Math.abs(sdRoundRect(dx, dy, PILL)) - PILL.stroke / 2;
          const arm = sdSegment(dx, dy, ARM.ax, ARM.ay, ARM.bx, ARM.by) - ARM.r;
          if (Math.min(ring, arm) <= 0) mark++;
        }
      }
      const n = SS * SS;
      const ta = tile / n, ma = mark / n;

      const a = ta;
      const r = INK[0] * (1 - ma) + PAPER[0] * ma;
      const g = INK[1] * (1 - ma) + PAPER[1] * ma;
      const b = INK[2] * (1 - ma) + PAPER[2] * ma;
      const o = (y * size + x) * 4;
      buf[o] = r; buf[o + 1] = g; buf[o + 2] = b; buf[o + 3] = Math.round(a * 255);
    }
  }
  return buf;
}

const CRC = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return (buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = t[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  };
})();
const chunk = (type, data) => {
  const body = Buffer.concat([Buffer.from(type, 'latin1'), data]);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(CRC(body));
  return Buffer.concat([len, body, crc]);
};
function png(size) {
  const rgba = render(size);
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function icoImage(size) {
  const rgba = render(size);
  const header = Buffer.alloc(40);
  header.writeUInt32LE(40, 0);
  header.writeInt32LE(size, 4);
  header.writeInt32LE(size * 2, 8);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  const xor = Buffer.alloc(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const src = ((size - 1 - y) * size + x) * 4;
      const dst = (y * size + x) * 4;
      xor[dst] = rgba[src + 2];
      xor[dst + 1] = rgba[src + 1];
      xor[dst + 2] = rgba[src];
      xor[dst + 3] = rgba[src + 3];
    }
  }
  const andRow = (Math.ceil(size / 8) + 3) & ~3;
  const and = Buffer.alloc(andRow * size);
  return Buffer.concat([header, xor, and]);
}
function ico(sizes) {
  const imgs = sizes.map(icoImage);
  const dir = Buffer.alloc(6 + 16 * sizes.length);
  dir.writeUInt16LE(0, 0); dir.writeUInt16LE(1, 2);
  dir.writeUInt16LE(sizes.length, 4);
  let offset = dir.length;
  sizes.forEach((size, i) => {
    const e = 6 + i * 16;
    dir[e] = size >= 256 ? 0 : size;
    dir[e + 1] = size >= 256 ? 0 : size;
    dir.writeUInt16LE(1, e + 4);
    dir.writeUInt16LE(32, e + 6);
    dir.writeUInt32LE(imgs[i].length, e + 8);
    dir.writeUInt32LE(offset, e + 12);
    offset += imgs[i].length;
  });
  return Buffer.concat([dir, ...imgs]);
}

writeFileSync('favicon.ico', ico([16, 32, 48]));
writeFileSync('favicon-96.png', png(96));
writeFileSync('apple-touch-icon.png', png(180));
console.log('wrote favicon.ico, favicon-96.png, apple-touch-icon.png');
