const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

async function main() {
  const mode = process.argv[2] || 'original';
  const out = path.resolve('recordings');
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 800 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: out,
      size: { width: 390, height: 800 }
    }
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.toString()));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  await page.goto('http://127.0.0.1:8000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(6000);
  const isFlutter = await page.evaluate(() => Boolean(
    document.querySelector('flt-glass-pane') ||
    document.querySelector('flutter-view') ||
    document.querySelector('flt-scene-host')
  ));
  console.log('Mode:', mode, 'Flutter root detected:', isFlutter);

  if (mode === 'original' || mode === 'customized') {
    const tap = async (x, y) => {
      await page.mouse.click(x, y);
      await page.waitForTimeout(650);
    };
    // Demonstrate a working calculation: C, 5, +, 3, =.
    await tap(55, 460);
    await tap(148, 604);
    await tap(342, 676);
    await tap(245, 676);
    await tap(342, 752);
  }

  if (mode === 'bug_before' || mode === 'bug_after') {
    const tap = async (x, y) => {
      await page.mouse.click(x, y);
      await page.waitForTimeout(650);
    };
    // Flutter calculator's approximate 4-column x 6-row mobile keypad.
    await tap(55, 445); // C (clear), then 9 * 9 =, 5 * 5
    await tap(245, 515); // 9
    await tap(342, 515); // *
    await tap(245, 515); // 9
    await tap(342, 742); // =
    await page.waitForTimeout(900);
    await tap(148, 590); // 5 (should start a fresh expression after fix)
    await tap(342, 515); // *
    await tap(148, 590); // 5
  }

  await page.screenshot({ path: path.join(out, mode + '.png') });
  await page.waitForTimeout(8500);
  const video = page.video();
  await context.close();
  await browser.close();
  const webmPath = await video.path();
  // Keep Playwright's native WebM recording. Convert to MP4 when downloaded.
  const output = path.join(out, mode + '.webm');
  fs.renameSync(webmPath, output);
  fs.writeFileSync(path.join(out, mode + '_console.txt'),
    'Flutter root detected: ' + isFlutter + '\n' + errors.join('\n') + '\n');
  console.log('Saved:', output, fs.statSync(output).size, 'bytes');
}
main().catch(error => { console.error(error); process.exit(1); });
