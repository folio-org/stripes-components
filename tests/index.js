require('babel-polyfill');

// require all test files matching 'lib/**/tests/*-test'
const requireTest = require.context('../lib/', true, /(.*?)\/tests\/(.*?)-test/);
requireTest.keys().forEach(requireTest);

// require all source files in lib for code coverage (except Pluggable)
const componentsContext = require.context('../lib/', true, /^(?!.*(stories|examples)).*\.js$/);
componentsContext.keys().filter(key => {
  return !key.includes('Pluggable');
}).forEach(componentsContext);
