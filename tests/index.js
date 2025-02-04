require('core-js/stable');
require('regenerator-runtime/runtime');

// require all test files matching 'lib/**/tests/*-test'
const requireTest = require.context('../lib/', true, /(.*?)\/tests\/(.*?)-test/);
const requireUtilTests = require.context('../lib/util/', true, /(.*?)\/tests\/(.*?)-test/);
const requireHooksTests = require.context('../lib/hooks/', true, /(.*?)\/tests\/(.*?)-test/);

requireTest.keys().forEach(requireTest);
requireUtilTests.keys().forEach(requireUtilTests);
requireHooksTests.keys().forEach(requireHooksTests);

// require all source files in lib for code coverage (except Pluggable)
const componentsContext = require.context('../lib/', true, /^(?!.*(stories|examples)).*\.js$/);
componentsContext.keys().filter(key => {
  return !key.includes('Pluggable');
}).forEach(componentsContext);
