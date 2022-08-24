const path = require('path');

const config = {
  entry: path.resolve('./index.js'),
  output: {
    library: {
      type: 'umd',
      name: '@folio/stripes-components',
    },
  },
};

module.exports = config;
