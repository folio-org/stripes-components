const customWebpack = require('./stcom-webpack.config.js');

const config = {
  features: {
    postcss: false, // we use our own postcss setup
  },

  stories: [{
    directory: '../guides',
    titlePrefix: 'Guides',
    files: '**/*.mdx'
  },
  {
    directory: '../lib',
    titlePrefix: 'Components',
    files: '**/*.stories.[tj]s'
  }],
  staticDirs: ['../guides/static'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-mdx-gfm'
  ],

  webpackFinal: customWebpack,

  framework: {
    name: '@storybook/react-webpack5',
    options: { fastRefresh: true }
  },

  docs: {
    autodocs: false
  },
};

export default config;
