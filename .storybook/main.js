const customWebpack = require('./stcom-webpack.config.js');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  features: {
    postcss: false, // we use our own postcss setup
  },
  stories: [{
    directory: '../docs',
    titlePrefix: 'Guides',
    files: '**/*.mdx'
  },
  {
    directory: '../lib',
    titlePrefix: 'Components',
    files: '**/*.stories.[tj]s'
  }],
  addons: [
    'storybook-readme/register',
    '@storybook/addon-essentials',
    'storybook-addon-intl/register',
    'storybook-addon-rtl/register',
    'storybook-addon-designs/register',
  ],
  webpackFinal: customWebpack
};
