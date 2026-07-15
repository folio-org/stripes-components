require('core-js/stable');
require('regenerator-runtime/runtime');

window.global = window;

const requireTest = require.context('./HotKeys', false, /\.js$/);

requireTest.keys().forEach(requireTest);
