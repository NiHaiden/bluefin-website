/**
 * Navbar visual regression test — standalone Playwright script
 * Checks TopNavbar matches docs.projectbluefin.io styling
 *
 * Prerequisites: dev server must be running at http://localhost:5173
 *   just serve   (from repo root)
 *
 * Run:
 *   node src/tests/navbar-visual.mjs
 */

import { chromium } from '/var/home/jorge/src/documentation/node_modules/playwright/index.mjs'

const URL = 'http://localhost:5173/'
const SCREENSHOT = '/tmp/nav-test-result.png'
const VIEWPORT = { width: 1440, height: 900 }

// ── Expected values ────────────────────────────────────────────────────────────
const EXPECTED_LINKS = [
  'Documentation',
  'Ask Bluefin',
  'Blog',
  'Changelogs',
  'Reports',
  'Discussions',
  'Feedback',
  'Store (US Only)',
]

const EXPECTED_LINK_FONT_SIZE = '16px'
const EXPECTED_LINK_FONT_WEIGHT = '500'
const EXPECTED_TITLE_FONT_SIZE = '16px'
const EXPECTED_TITLE_FONT_WEIGHT = '700'

// ── Helpers ────────────────────────────────────────────────────────────────────
let passed = 0
let failed = 0

function assert(label, actual, expected) {
  const ok = actual === expected
  const status = ok ? '✅ PASS' : '❌ FAIL'
  if (ok) {
    passed++
    console.log(`  ${status}  ${label}`)
    console.log(`           got: ${actual}`)
  }
  else {
    failed++
    console.log(`  ${status}  ${label}`)
    console.log(`           expected: ${expected}`)
    console.log(`           got:      ${actual}`)
  }
  return ok
}

function assertContains(label, list, item) {
  const ok = list.includes(item)
  const status = ok ? '✅ PASS' : '❌ FAIL'
  if (ok) {
    passed++
    console.log(`  ${status}  ${label}`)
  }
  else {
    failed++
    console.log(`  ${status}  ${label}`)
    console.log(`           "${item}" not found in [${list.join(', ')}]`)
  }
  return ok
}

// ── Main ───────────────────────────────────────────────────────────────────────
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize(VIEWPORT)

console.log(`\n🔵  Bluefin TopNavbar visual test`)
console.log(`    URL:        ${URL}`)
console.log(`    Viewport:   ${VIEWPORT.width}×${VIEWPORT.height}`)
console.log(`    Screenshot: ${SCREENSHOT}\n`)

// ── Load page ──────────────────────────────────────────────────────────────────
try {
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30_000 })
}
catch {
  // networkidle sometimes times out on animation-heavy pages — that's fine
}
await page.waitForTimeout(2000)

// ── Section 1: .navbar__link computed CSS ─────────────────────────────────────
console.log('── Section 1: .navbar__link computed CSS ──')

const linkHandle = await page.$('.navbar__link:not(.navbar__link--active)')
if (!linkHandle) {
  console.log('  ❌ FAIL  .navbar__link not found in DOM — is the server running?\n')
  failed++
}
else {
  const linkStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el)
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    }
  }, linkHandle)

  assert('.navbar__link  fontSize', linkStyles.fontSize, EXPECTED_LINK_FONT_SIZE)
  assert('.navbar__link  fontWeight', linkStyles.fontWeight, EXPECTED_LINK_FONT_WEIGHT)
}

// ── Section 2: .navbar__title computed CSS ────────────────────────────────────
console.log('\n── Section 2: .navbar__title computed CSS ──')

const titleHandle = await page.$('.navbar__title')
if (!titleHandle) {
  console.log('  ❌ FAIL  .navbar__title not found in DOM\n')
  failed++
}
else {
  const titleStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el)
    return {
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    }
  }, titleHandle)

  assert('.navbar__title  fontSize', titleStyles.fontSize, EXPECTED_TITLE_FONT_SIZE)
  assert('.navbar__title  fontWeight', titleStyles.fontWeight, EXPECTED_TITLE_FONT_WEIGHT)
}

// ── Section 3: nav link text presence ─────────────────────────────────────────
console.log('\n── Section 3: nav link text presence ──')

const linkTexts = await page.$$eval('.navbar__link', els =>
  els.map(el => el.textContent?.trim()).filter(Boolean))
console.log(`  Found links: [${linkTexts.join(', ')}]`)

for (const expected of EXPECTED_LINKS) {
  assertContains(`link text "${expected}"`, linkTexts, expected)
}

// ── Section 4: spacing and sizing ───────────────────────────────────────────
console.log('\n── Section 4: spacing and sizing ──')

const brandHandle = await page.$('.navbar__brand')
if (!brandHandle) {
  console.log('  ❌ FAIL  .navbar__brand not found in DOM')
  failed++
}
else {
  const brandMarginRight = await page.evaluate(
    el => window.getComputedStyle(el).marginRight,
    brandHandle,
  )
  assert('.navbar__brand  marginRight', brandMarginRight, '16px')
}

const logoImgHandle = await page.$('.navbar__logo img')
if (!logoImgHandle) {
  console.log('  ❌ FAIL  .navbar__logo img not found in DOM')
  failed++
}
else {
  const logoHeight = await page.evaluate(
    el => window.getComputedStyle(el).height,
    logoImgHandle,
  )
  assert('.navbar__logo img  height', logoHeight, '32px')
}

const docusaurusNavHandle = await page.$('.docusaurus-navbar')
if (!docusaurusNavHandle) {
  console.log('  ❌ FAIL  .docusaurus-navbar not found in DOM')
  failed++
}
else {
  const navHeight = await page.evaluate(
    el => window.getComputedStyle(el).height,
    docusaurusNavHandle,
  )
  assert('.docusaurus-navbar  height', navHeight, '60px')
}

// ── Section 5: active link styling ───────────────────────────────────────────
console.log('\n── Section 5: active link styling ──')

const activeLinkHandle = await page.$('.navbar__link--active')
if (!activeLinkHandle) {
  console.log('  ❌ FAIL  .navbar__link--active not found in DOM')
  failed++
}
else {
  const activeStyles = await page.evaluate((el) => {
    const cs = window.getComputedStyle(el)
    return {
      color: cs.color,
      fontWeight: cs.fontWeight,
    }
  }, activeLinkHandle)

  assert('.navbar__link--active  color', activeStyles.color, 'rgb(74, 105, 189)')
  assert('.navbar__link--active  fontWeight', activeStyles.fontWeight, '600')
}

// ── Section 6: right-side links exist and are in correct order ────────────────
console.log('\n── Section 6: right-side links order ──')

const EXPECTED_RIGHT_LINKS = ['Blog', 'Changelogs', 'Reports', 'Discussions', 'Feedback', 'Store (US Only)']

const rightLinkTexts = await page.$$eval(
  '.navbar__items--right .navbar__link',
  els => els.map(el => el.textContent?.trim()).filter(Boolean),
)
console.log(`  Found right-side links: [${rightLinkTexts.join(', ')}]`)

if (rightLinkTexts.length === 0) {
  console.log('  ❌ FAIL  No .navbar__items--right .navbar__link elements found')
  failed++
}
else {
  const actualOrder = JSON.stringify(rightLinkTexts)
  const expectedOrder = JSON.stringify(EXPECTED_RIGHT_LINKS)
  assert('right-side links order', actualOrder, expectedOrder)
}

// ── Screenshot ────────────────────────────────────────────────────────────────
await page.screenshot({ path: SCREENSHOT, fullPage: false })
console.log(`\n📸  Screenshot saved → ${SCREENSHOT}`)

// ── Summary ───────────────────────────────────────────────────────────────────
const total = passed + failed
console.log('\n══════════════════════════════════════════════')
if (failed === 0) {
  console.log(`✅  ALL ${total} assertions PASSED`)
}
else {
  console.log(`❌  ${failed}/${total} assertions FAILED`)
  console.log('\n   Interpretation:')
  console.log('   These failures show the delta between the current component CSS')
  console.log('   and the target docs.projectbluefin.io Docusaurus navbar styling.')
}
console.log('══════════════════════════════════════════════\n')

await browser.close()
process.exit(failed > 0 ? 1 : 0)
