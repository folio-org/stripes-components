const customWebpack = require('./stcom-webpack.config.js');

module.exports = {
  core: {
    builder: 'webpack5',
  },
  features: {
    postcss: false, // we use our own postcss setup
  },
  stories: ['../lib/**/*.stories.[tj]s'],
  addons: [
    'storybook-readme/register',
    '@storybook/addon-actions/register',
    'storybook-addon-intl/register',
    'storybook-addon-rtl/register',
    'storybook-addon-designs/register',
  ],
  webpackFinal: customWebpack
};
