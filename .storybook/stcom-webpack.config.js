// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.
const path = require('path');

const babelOpts = {
  cacheDirectory: true,
  presets: [
    ['@babel/preset-env', {
      'targets': '> 0.25%, not dead',
    }],
    '@babel/preset-react',
  ],
  plugins: [
    // Stage 2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',

    // Stage 3
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],

    // Others
    'react-hot-loader/babel',
  ]
};


module.exports = async (config) => {
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
              require('postcss-custom-properties')({ preserve: false, importFrom: './lib/variables.css' }),
              require('postcss-calc'),
              require('postcss-nesting'),
              require('postcss-custom-media'),
              require('postcss-media-minmax'),
              require('postcss-color-function'),
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
      options: babelOpts,
    };

    config.module.rules = config.module.rules.concat([
    {
      test: /\.mdx$/,
      use: [
        {
          loader: 'babel-loader',
          options: babelOpts,
        },
         '@mdx-js/loader'
      ]
    },
    {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loader: "file-loader"
    },
    {
      test: /\.(eot|ttf|woff|woff2?)$/,
      loader: 'file-loader?name=fonts/[name].[hash].[ext]',
    }
  ]);

  return config;
}
