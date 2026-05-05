import { readFileSync, readdirSync } from 'node:fs'
import { join, basename } from 'node:path'

const MODELS_DIR = new URL('../public/models', import.meta.url).pathname

function extractMaterials(filePath) {
  const buf = readFileSync(filePath)

  // GLB header: magic(4) + version(4) + length(4) = 12 bytes
  // Chunk 0 header: chunkLength(4) + chunkType(4) = 8 bytes, then JSON data
  const chunkLength = buf.readUInt32LE(12)
  const chunkType   = buf.readUInt32LE(16)

  if (chunkType !== 0x4E4F534A) {
    return ['(no JSON chunk found)']
  }

  const json = JSON.parse(buf.subarray(20, 20 + chunkLength).toString('utf8'))
  return (json.materials ?? []).map((m) => m.name ?? '(unnamed)')
}

const files = readdirSync(MODELS_DIR)
  .filter((f) => f.endsWith('.glb'))
  .sort()

for (const file of files) {
  const materials = extractMaterials(join(MODELS_DIR, file))
  console.log(`\n── ${basename(file)}`)
  if (materials.length === 0) {
    console.log('   (no materials)')
  } else {
    materials.forEach((m) => console.log(`   • ${m}`))
  }
}
