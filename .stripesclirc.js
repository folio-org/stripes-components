const webpack = require('webpack');

// Inject babel-plugin-istanbul into the webpack config.
const testPlugin = {
  options: {
    coverage: {
      describe: 'Enable Karma coverage reports',
      type: 'boolean',
      alias: 'karma.coverage',
    },
  },
  beforeBuild: (options) => {
    return (config) => {
      let babelLoaderConfigIndex = config.module.rules.findIndex((rule) => {
        return rule.loader === 'babel-loader';
      });

      if(!config.module.rules[babelLoaderConfigIndex].options.plugins) {
        config.module.rules[babelLoaderConfigIndex].options.plugins = [];
      }

      if (options.coverage || options.karma.coverage) {
        config.module.rules[babelLoaderConfigIndex].options.plugins.push(
          require.resolve('babel-plugin-istanbul')
        );
      }

      return config;
    };
  },
}

module.exports = {
  plugins: {
    test: testPlugin
  }
};
