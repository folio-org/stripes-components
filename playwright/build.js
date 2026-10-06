/* eslint-disable no-console */
// Builds the test bundle (tests/index.js) with the same webpack config that
// `stripes test karma` uses, plus an index.html that runs mocha in a nested iframe.
const fs = require('fs');
const path = require('path');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies -- provided by stripes-webpack

const root = path.resolve(__dirname, '..');

// Uses the installed stripes-cli and the stripes-webpack that the CLI itself resolves.
// STRIPES_CLI_PATH / STRIPES_WEBPACK_PATH may point at local checkouts (e.g. a FOLIO workspace)
// when the installed pair is out of sync.
const cliRoot = fs.realpathSync(process.env.STRIPES_CLI_PATH
  || path.dirname(require.resolve('@folio/stripes-cli/package.json', { paths: [root] })));
const webpackRoot = fs.realpathSync(process.env.STRIPES_WEBPACK_PATH
  || path.dirname(require.resolve('@folio/stripes-webpack/package.json', { paths: [cliRoot] })));
const { applyContext } = require(path.join(cliRoot, 'lib/cli/context-middleware')); // eslint-disable-line
const StripesCore = require(path.join(cliRoot, 'lib/cli/stripes-core')); // eslint-disable-line
const StripesPlatform = require(path.join(cliRoot, 'lib/platform/stripes-platform')); // eslint-disable-line

const mochaJs = require.resolve('mocha/mocha.js');

function getWebpackConfig({ coverage, outDir }) {
  process.env.NODE_ENV = process.env.NODE_ENV || 'test';
  const argv = applyContext({ workingDir: root });
  const { context } = argv;
  const platform = new StripesPlatform(undefined, context, argv);
  const webpackOverrides = platform.getWebpackOverrides(context);
  // Some stripes-webpack versions require a favicon in the branding config; tests don't care which.
  const stripesConfig = platform.getStripesConfig();
  if (!stripesConfig.branding?.favicon?.src) {
    stripesConfig.branding = { ...stripesConfig.branding, favicon: { src: path.join(outDir, 'favicon.png') } };
  }
  const stripes = new StripesCore(context, { ...platform.aliases, '@folio/stripes-webpack': webpackRoot });
  const config = stripes.getStripesWebpackConfig(
    stripesConfig,
    { coverage, omitPlatform: true, webpackOverrides },
    context
  );

  config.module.exprContextCritical = false;
  config.mode = 'none';
  config.entry = { tests: path.join(root, 'tests/index.js') };
  config.output = { ...config.output, path: outDir, filename: '[name].js', publicPath: '' };
  config.externals = [].concat(config.externals || [], { mocha: 'mochaExports' });
  config.watch = false;
  return config;
}

// Outer page holds an iframe so `viewport.set/reset` (formerly karma-viewport) can resize it.
const outerHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>stripes-components tests</title>
<style>html,body{margin:0;height:100%}#tests{border:0;width:100%;height:100%;display:block}</style>
</head><body><iframe id="tests" src="context.html"></iframe></body></html>`;

const contextHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body>
<script src="mocha.js"></script>
<script src="viewport.js"></script>
<script>
// No DOM reporter: results are sent to Node (run.js) and mocha's report markup must not pollute the page under test.
mocha.setup({ ui: 'bdd', timeout: 2000, reporter: function NoopReporter() {} });
// Tests import { describe, it } from 'mocha'; webpack maps 'mocha' to this global (see externals).
window.mochaExports = {
  describe, it, context, specify, before, after, beforeEach, afterEach,
  xdescribe, xit, xcontext, xspecify
};
</script>
<script src="tests.js"></script>
<script src="run.js"></script>
</body></html>`;

// Mocha is configured by the Node runner via window.__mochaOptions (grep etc.).
const runJs = `
const opts = window.__mochaOptions || {};
if (opts.grep) { mocha.grep(opts.grep); }
const runner = mocha.run();
const report = window.__report;
['suite', 'suite end', 'pass', 'fail', 'pending', 'end'].forEach((evt) => {
  runner.on(evt, (item, err) => {
    report(evt, item && {
      title: item.title,
      fullTitle: item.fullTitle && item.fullTitle(),
      file: item.file,
      duration: item.duration,
      err: err ? { message: err.message || String(err), stack: err.stack || err.message || String(err) } : undefined
    });
  });
});
runner.on('end', () => report('done', { coverage: window.__coverage__ || null }));
`;

const viewportJs = `
window.viewport = {
  set(width, height) {
    const el = window.frameElement;
    el.style.width = width + 'px';
    if (height) { el.style.height = height + 'px'; }
    el.contentDocument.body.getBoundingClientRect();
  },
  reset() {
    const el = window.frameElement;
    el.style.width = '';
    el.style.height = '';
    el.contentDocument.body.getBoundingClientRect();
  }
};
`;

function writeStatic(outDir) {
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'runner.html'), outerHtml);
  fs.writeFileSync(path.join(outDir, 'context.html'), contextHtml);
  fs.writeFileSync(path.join(outDir, 'run.js'), runJs);
  fs.writeFileSync(path.join(outDir, 'viewport.js'), viewportJs);
  fs.writeFileSync(path.join(outDir, 'favicon.png'), Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64'
  ));
  fs.copyFileSync(mochaJs, path.join(outDir, 'mocha.js'));
}

// Returns a webpack compiler; caller decides between run() and watch().
function createCompiler(opts) {
  writeStatic(opts.outDir);
  return webpack(getWebpackConfig(opts));
}

module.exports = { createCompiler };
