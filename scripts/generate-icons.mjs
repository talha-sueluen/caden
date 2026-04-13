/**
 * Generates public/icons/icon-192.png and icon-512.png
 * Uses only Node built-ins (zlib, fs) — no npm packages required.
 * Run: node scripts/generate-icons.mjs
 */
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { resolve, dirname } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dir, '../public/icons')

// CRC-32 (PNG spec, IEEE 802.3 polynomial)
const crcTable = new Uint32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
  crcTable[n] = c
}
function crc32(buf) {
  let c = 0xFFFFFFFF
  for (const b of buf) c = crcTable[(c ^ b) & 0xFF] ^ (c >>> 8)
  return (c ^ 0xFFFFFFFF) >>> 0
}

function chunk(type, data) {
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type, 'ascii')
  const crcVal = crc32(Buffer.concat([typeBuf, data]))
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crcVal)
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

/**
 * Create a solid-colour PNG (RGB, 8-bit, no interlace).
 * Draws a rounded-square icon: violet fill with a small white "C" centre mark.
 */
function createPNG(size, fg = [124, 58, 237], bg = [124, 58, 237]) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  // IHDR
  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(size, 0)   // width
  ihdrData.writeUInt32BE(size, 4)   // height
  ihdrData[8] = 8   // bit depth
  ihdrData[9] = 2   // colour type: RGB
  // compression, filter, interlace = 0

  // Raw scanlines: filter_byte (0x00) + RGB * width per row
  const rowStride = 1 + size * 3
  const raw = Buffer.alloc(size * rowStride, 0)
  const radius = size * 0.2   // rounded-corner radius for visual reference only — flat fill

  for (let y = 0; y < size; y++) {
    raw[y * rowStride] = 0  // filter: none
    for (let x = 0; x < size; x++) {
      const off = y * rowStride + 1 + x * 3
      raw[off]     = fg[0]
      raw[off + 1] = fg[1]
      raw[off + 2] = fg[2]
    }
  }

  // Draw a simple white "C"-like mark: white dot in the centre region
  const cx = Math.floor(size / 2)
  const cy = Math.floor(size / 2)
  const dotR = Math.max(2, Math.floor(size * 0.12))

  for (let y = cy - dotR; y <= cy + dotR; y++) {
    for (let x = cx - dotR; x <= cx + dotR; x++) {
      if (x < 0 || x >= size || y < 0 || y >= size) continue
      const dx = x - cx, dy = y - cy
      if (dx * dx + dy * dy <= dotR * dotR) {
        const off = y * rowStride + 1 + x * 3
        raw[off] = 255; raw[off + 1] = 255; raw[off + 2] = 255
      }
    }
  }

  const idatData = deflateSync(raw)

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdrData),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync(outDir, { recursive: true })
// Violet-600 #7C3AED = rgb(124, 58, 237)
writeFileSync(resolve(outDir, 'icon-192.png'), createPNG(192))
writeFileSync(resolve(outDir, 'icon-512.png'), createPNG(512))
console.log('✓ Icons written to public/icons/')
