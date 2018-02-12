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
  entry: [
    'typeface-source-sans-pro'
  ],
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
            [require.resolve('babel-preset-env'), { modules: false }],
            [require.resolve('babel-preset-stage-2')],
            [require.resolve('babel-preset-react')],
          ],
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader?modules&localIdentName=[local]---[hash:base64:5]',
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
            },
          },
        ],
      },
      {
        test: /\.(woff2?)$/,
        loader: 'file-loader?name=fonts/[name].[hash].[ext]',
      }
    ],
  },
};
