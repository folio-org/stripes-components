// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const path = require('path');
const postCssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const postCssCustomProperties = require('postcss-custom-properties');
const postCssCalc = require('postcss-calc');
const postCssNesting = require('postcss-nesting');
const postCssCustomMedia = require('postcss-custom-media');
const postCssMediaMinMax = require('postcss-media-minmax');
const postCssColorFunction = require('postcss-color-function');

module.exports = {
  plugins: [
    // your custom plugins
  ],
  module: {
    rules: [
      {
        test(fn) {
          // We want to transpile files inside node_modules/@folio or outside
          // any node_modules directory. And definitely not files in
          // node_modules outside the @folio namespace even if some parent
          // directory happens to be in @folio.
          //
          // fn is the path after all symlinks are resolved so we need to be
          // wary of all the edge cases yarn link will find for us.
          const nmidx = fn.lastIndexOf('node_modules');
          if (fn.endsWith('.js') && (nmidx === -1 || fn.lastIndexOf('@folio') > nmidx)) return true;
          return false;
        },
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            ['@babel/preset-env'],
            ['@babel/preset-react'],
          ],
          plugins: [
            // Stage 2
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-function-sent'],
            ['@babel/plugin-proposal-export-namespace-from'],
            ['@babel/plugin-proposal-numeric-separator'],
            ['@babel/plugin-proposal-throw-expressions'],

            // Stage 3
            ['@babel/plugin-syntax-dynamic-import'],
            ['@babel/plugin-syntax-import-meta'],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            ['@babel/plugin-proposal-json-strings'],

            // Others
            ['@babel/plugin-proposal-optional-chaining'],
            ['react-hot-loader/babel'],
          ]
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: "file-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[local]---[hash:base64:5]',
              modules: true,
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                postCssImport(),
                autoprefixer(),
                postCssCustomProperties(),
                postCssCalc(),
                postCssNesting(),
                postCssCustomMedia(),
                postCssMediaMinMax(),
                postCssColorFunction(),
              ],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2?)$/,
        loader: 'file-loader?name=fonts/[name].[hash].[ext]',
      }
    ],
  },
};
