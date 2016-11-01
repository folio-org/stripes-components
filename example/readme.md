# Stripes Toolkit example
### Usage
`uikit` directory should be placed where FOLIO modules are accessed. 

An Entry for uikit should be created in `webpack.config.cli.js`
example: 

if uikit directory is placed at `node_modules/@folio-sample-modules`
```js
const path = require('path');
const webpack = require('webpack');

module.exports = {
  output: { /*output specifics...*/ },
  stripesLoader: {
    okapi: { 'url':'http://localhost:9130' },
    modules: {
      '@folio-sample-modules/trivial': {},
      '@folio-sample-modules/uikit': {} // uikit example
    }
  }
};
```