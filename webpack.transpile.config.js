const path = require('path');

const config = {
  entry: path.resolve('./index.js'),
  output: {
    library: {
      type: 'umd',
      name: '@folio/stripes-components',
    },
    path: path.resolve('./dist'),
    filename: 'index.js',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
      umd: 'react'
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
      umd: 'react-dom'
    },
    'react-intl': {
      root: 'ReactIntl',
      commonjs2: 'react-intl',
      commonjs: 'react-intl',
      amd: 'react-intl',
      umd: 'react-intl'
    },
    'react-router': {
      root: 'ReactRouter',
      commonjs2: 'react-router',
      commonjs: 'react-router',
      amd: 'react-router',
      umd: 'react-router'
    },
    moment: {
      root: 'moment',
      commonjs2: 'moment',
      commonjs: 'moment',
      amd: 'moment',
      umd: 'moment'
    }
  }
};

module.exports = config;
