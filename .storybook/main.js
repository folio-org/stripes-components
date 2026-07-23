import customWebpack from './stcom-webpack.config.js';

const stories = [
  '../guides/**/*.mdx',
  '../lib/**/*.readme.mdx',
  '../lib/**/*.stories.[tj]s',
];

const config = {
  features: {
    postcss: false, // we use our own postcss setup
  },

  stories,
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
