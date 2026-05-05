// Pre-build script: downloads LFS-tracked GLBs from GitHub during Vercel builds.
// Vercel clones repos without fetching LFS objects, so this script resolves
// the pointer files to real binaries before Vite runs.
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

const MODELS_DIR = './public/models'
const REPO      = 'nwilkens4/gt-studio'
const GH_TOKEN  = process.env.GH_TOKEN

if (!GH_TOKEN) {
  console.log('No GH_TOKEN set — assuming real GLBs are present (local dev)')
  process.exit(0)
}

function parseLFSPointer(content) {
  const oid  = content.match(/oid sha256:([a-f0-9]+)/)?.[1]
  const size = parseInt(content.match(/size (\d+)/)?.[1] ?? '0')
  return oid ? { oid, size } : null
}

const files = readdirSync(MODELS_DIR).filter((f) => f.endsWith('.glb'))
const lfsFiles = []

for (const file of files) {
  const filePath = join(MODELS_DIR, file)
  const bytes = statSync(filePath).size
  if (bytes < 512) {
    const pointer = parseLFSPointer(readFileSync(filePath, 'utf8'))
    if (pointer) lfsFiles.push({ file, filePath, ...pointer })
  }
}

if (lfsFiles.length === 0) {
  console.log('GLBs are already real files — nothing to download.')
  process.exit(0)
}

console.log(`Downloading ${lfsFiles.length} GLB(s) from GitHub LFS...`)

const batchRes = await fetch(`https://github.com/${REPO}.git/info/lfs/objects/batch`, {
  method: 'POST',
  headers: {
    Authorization:  `Bearer ${GH_TOKEN}`,
    'Content-Type': 'application/vnd.git-lfs+json',
    Accept:         'application/vnd.git-lfs+json',
  },
  body: JSON.stringify({
    operation: 'download',
    transfers: ['basic'],
    objects: lfsFiles.map(({ oid, size }) => ({ oid, size })),
  }),
})

if (!batchRes.ok) {
  console.error(`LFS batch request failed: ${batchRes.status} ${await batchRes.text()}`)
  process.exit(1)
}

const { objects } = await batchRes.json()

for (const obj of objects) {
  const info = lfsFiles.find((f) => f.oid === obj.oid)
  if (!info) continue

  const url = obj.actions?.download?.href
  if (!url) { console.error(`No download URL for ${info.file}`); continue }

  const mb = (info.size / 1024 / 1024).toFixed(1)
  process.stdout.write(`  ${info.file} (${mb} MB)... `)

  const res = await fetch(url)
  if (!res.ok) { console.error(`failed (${res.status})`); continue }

  writeFileSync(info.filePath, Buffer.from(await res.arrayBuffer()))
  console.log('done')
}

console.log('All models ready.')
