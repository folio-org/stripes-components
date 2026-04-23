import customWebpack from './stcom-webpack.config.js';

const config = {
  features: {
    postcss: false, // we use our own postcss setup
  },

  stories: [
    '../guides/**/*.mdx',
    '../lib/**/*.stories.[tj]s'
  ],
  staticDirs: ['../guides/static'],
  addons: [
    '@storybook/addon-docs'
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
