// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const path = require('path');
const { babelOptions } = require('@folio/stripes-cli');

// strip react-refresh since storybook already uses it
const adjustedBabelOptions = Object.assign(babelOptions, { plugins: babelOptions.plugins.filter((p) => !p.includes('react-refresh')) });

module.exports = async (config) => {
  config.devtool='eval-cheap-module-source-map';
  // Replace Storybook's own CSS config
  // get index of their css loading rule...
  const cssRuleIndex = config.module.rules.findIndex(r => { const t = new RegExp(r.test); return t.test('m.css'); });
  config.module.rules[cssRuleIndex] = {
    test: /\.css$/,
    use: [
      {
        loader: 'style-loader',
      },
      {
        loader: 'css-loader',
        options: {
          modules: {
            localIdentName: '[local]---[hash:base64:5]',
          },
          sourceMap: true,
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            plugins: [
              require('postcss-import'),
              require('autoprefixer'),
              require('postcss-custom-properties')({ preserve: false, importFrom: './lib/variables.css', disableDeprecationNotice: true }),
              require('postcss-nesting'),
              require('postcss-custom-media'),
              require('postcss-media-minmax'),
              require('@csstools/postcss-relative-color-syntax'),
            ],
          },
          sourceMap: true,
        },
      },
    ],
  };

  // Add additional required loaders for stripes/components
  const jsRuleIndex = config.module.rules.findIndex(r => { const t = new RegExp(r.test); return t.test('m.js'); });
  config.module.rules[jsRuleIndex] =
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
      options: adjustedBabelOptions,
    };

    config.module.rules = config.module.rules.concat([
    {
      test: /\.(jpe?g|png|gif)$/i,
      type: 'asset/resource',
      generator: {
        filename: './img/[name].[contenthash].[ext]'
      }
    },

    {
      test: /\.(eot|ttf|woff|woff2?)$/,
      type: 'asset/resource',
      generator: {
        filename: './fonts/[name].[hash].[ext]'
      }
    }
  ]);

  const svgRuleIndex = config.module.rules.findIndex(r => { const t = new RegExp(r.test); return t.test('m.svg'); });
  const svgrRules = [
    {
      test: /\.svg$/,
      type: 'asset',
      resourceQuery: { not: [/icon/] }, // exclude built-in icons from stripes-components
    },
    {
      test: /\.svg$/,
      resourceQuery: /icon/,
      use: ['@svgr/webpack'],
    },
  ];

  config.module.rules.splice(svgRuleIndex,2, ...svgrRules);
  return config;
}
