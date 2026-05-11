#!/usr/bin/env node

/**
 * Script to update dakota-versions.json with release metadata from
 * projectbluefin/dakota GitHub Releases API.
 *
 * Current approach: fetches the latest release tag and publication date,
 * updates generatedAt and releaseTag while preserving existing package versions.
 *
 * TODO (proper fix): Query the OCI SBOM attestation for exact installed package
 * versions:
 *   cosign download attestation ghcr.io/projectbluefin/dakota:<tag> \
 *     | jq -r '.payload' | base64 -d | jq '.predicate.components[] | select(.name == "kernel")'
 * This would use the syft JSON schema embedded in the image attestation and is
 * immune to any changelog format changes.
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.join(__dirname, '../public/dakota-versions.json')
const GITHUB_API = 'https://api.github.com'

async function main() {
  const headers = {
    'User-Agent': 'bluefin-website-updater',
    ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
  }

  const res = await fetch(`${GITHUB_API}/repos/projectbluefin/dakota/releases/latest`, { headers })
  if (!res.ok) {
    console.warn(`[dakota-versions] releases API returned ${res.status} — skipping update`)
    return
  }

  const release = await res.json()
  const current = JSON.parse(fs.readFileSync(OUT, 'utf8'))

  current.generatedAt = release.published_at ?? new Date().toISOString()
  current.releaseTag = release.tag_name

  fs.writeFileSync(OUT, `${JSON.stringify(current, null, 2)}\n`)
  console.info(`[dakota-versions] updated to ${release.tag_name} (${current.generatedAt})`)
}

main().catch((e) => {
  console.error('[dakota-versions] error:', e.message)
  process.exit(0)
})
