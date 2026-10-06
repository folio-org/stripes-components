#!/usr/bin/env node
/* eslint-disable no-console */
// Runs the mocha test bundle in a Playwright-driven browser (replaces `stripes test karma`).
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { parseArgs } = require('node:util');

const { values: args } = parseArgs({
  options: {
    browser: { type: 'string', default: 'chromium' },
    coverage: { type: 'boolean', default: false },
    headed: { type: 'boolean', default: false },
    grep: { type: 'string' },
    timeout: { type: 'string', default: '1800' }, // overall seconds
  },
});

const root = path.resolve(__dirname, '..');
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sc-pw-'));
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
};

function serve() {
  const server = http.createServer((req, res) => {
    const file = path.join(outDir, decodeURIComponent(req.url.split('?')[0]));
    if (!file.startsWith(outDir) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function build() {
  const { createCompiler } = require('./build'); // eslint-disable-line global-require
  const compiler = createCompiler({ coverage: args.coverage, outDir });
  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      if (stats.hasErrors()) {
        console.error(stats.toString({ all: false, errors: true, colors: true }));
        reject(new Error('webpack build failed'));
        return;
      }
      resolve();
    });
  });
}

const XML_ESCAPES = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' };
const esc = s => String(s ?? '').replace(/[<>&"']/g, c => XML_ESCAPES[c]);

function writeJunit(results, browserName) {
  const dir = path.join(root, 'artifacts/runTest');
  fs.mkdirSync(dir, { recursive: true });
  const failures = results.filter(r => r.state === 'failed').length;
  const skipped = results.filter(r => r.state === 'pending').length;
  const time = results.reduce((t, r) => t + (r.duration || 0), 0) / 1000;
  const cases = results.map((r) => {
    let body = '';
    if (r.state === 'failed') {
      body = `<failure message="${esc(r.err?.message)}">${esc(r.err?.stack)}</failure>`;
    } else if (r.state === 'pending') {
      body = '<skipped/>';
    }
    return `<testcase name="${esc(r.title)}" classname="${esc(`${browserName}.${r.suite}`)}" time="${(r.duration || 0) / 1000}">${body}</testcase>`;
  }).join('\n    ');
  fs.writeFileSync(
    path.join(dir, `TESTS-${browserName}.xml`),
    `<?xml version="1.0" encoding="UTF-8"?>\n<testsuites>\n  <testsuite name="stripes-components (${browserName})" tests="${results.length}" failures="${failures}" skipped="${skipped}" time="${time}">\n    ${cases}\n  </testsuite>\n</testsuites>\n`
  );
}

function writeCoverage(coverage) {
  const libCoverage = require('istanbul-lib-coverage'); // eslint-disable-line global-require
  const libReport = require('istanbul-lib-report'); // eslint-disable-line global-require
  const reports = require('istanbul-reports'); // eslint-disable-line global-require
  const map = libCoverage.createCoverageMap(coverage);
  const context = libReport.createContext({ dir: path.join(root, 'artifacts/coverage'), coverageMap: map });
  ['text-summary', 'lcov'].forEach(r => reports.create(r).execute(context));
}

async function runBrowser(baseUrl) {
  const playwright = require('playwright'); // eslint-disable-line global-require
  const type = playwright[args.browser];
  if (!type) {
    throw new Error(`Unknown browser "${args.browser}" (chromium|firefox|webkit)`);
  }
  const launchArgs = args.browser === 'chromium' ? ['--no-sandbox', '--disable-web-security'] : [];
  const browser = await type.launch({ headless: !args.headed, args: launchArgs });
  const page = await browser.newPage({ viewport: { width: 1024, height: 768 } });

  const results = [];
  const suiteStack = [];
  let started = false;
  let coverage;
  let finish;
  const done = new Promise((resolve) => { finish = resolve; });

  await page.exposeFunction('__report', (evt, item) => {
    switch (evt) {
      case 'suite':
        started = true;
        if (item.title) suiteStack.push(item.title);
        break;
      case 'suite end':
        if (item.title) suiteStack.pop();
        break;
      case 'pass':
      case 'fail':
      case 'pending': {
        let state = 'pending';
        if (evt === 'fail') state = 'failed';
        if (evt === 'pass') state = 'passed';
        results.push({ ...item, state, suite: suiteStack.join(' ') });
        const mark = { passed: '✓', failed: '✗', pending: '-' }[state];
        if (state !== 'passed' || process.env.VERBOSE) console.log(`  ${mark} ${item.fullTitle}`);
        if (state === 'failed') console.log(`      ${item.err?.message}`);
        break;
      }
      case 'done':
        coverage = item.coverage;
        finish();
        break;
      default:
    }
  });
  await page.addInitScript((opts) => { window.__mochaOptions = opts; }, { grep: args.grep });
  page.on('pageerror', (e) => {
    console.error('[pageerror]', e.message);
    if (!started) {
      console.error('Test bundle failed to load; aborting.');
      process.exit(2);
    }
  });
  if (process.env.BROWSER_LOGS) page.on('console', m => console.log('[console]', m.text()));

  await page.goto(`${baseUrl}/runner.html`);
  const timer = setTimeout(() => {
    console.error('Timed out');
    process.exit(2);
  }, Number(args.timeout) * 1000);
  await done;
  clearTimeout(timer);
  await browser.close();

  const failed = results.filter(r => r.state === 'failed');
  const passed = results.filter(r => r.state === 'passed').length;
  const pending = results.filter(r => r.state === 'pending').length;
  console.log(`\n[${args.browser}] ${passed} passed, ${failed.length} failed, ${pending} skipped (${results.length} total)`);
  failed.forEach((r) => { console.log(`\nFAILED: ${r.fullTitle}\n${r.err?.stack}`); });
  writeJunit(results, args.browser);
  if (args.coverage && coverage) writeCoverage(coverage);
  return failed.length === 0;
}

(async () => {
  await build();
  const server = await serve();
  const ok = await runBrowser(`http://127.0.0.1:${server.address().port}`);
  server.close();
  fs.rmSync(outDir, { recursive: true, force: true });
  process.exit(ok ? 0 : 1);
})().catch((e) => {
  console.error(e);
  process.exit(2);
});
