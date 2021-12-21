const karmaViewport = require('karma-viewport');

module.exports = (config) => {
  const configuration = {
    browserStack: {
      project: 'stripes-components'
    },

    browserDisconnectTimeout: 3e5,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 3e5,
    captureTimeout: 3e5,

    customLaunchers: {
      bs_safari_11: {
        base: 'BrowserStack',
        os: 'OS X',
        os_version: 'High Sierra',
        browser: 'safari',
        browser_version: '11.1'
      },
      bs_ieEdge_windows: {
        base: 'BrowserStack',
        browser: 'edge',
        browser_version: '15.0',
        os: 'Windows',
        os_version: '10'
      }
    },
    frameworks: [...config.frameworks, 'viewport'],
    plugins: [...config.plugins, karmaViewport, 'karma-browserstack-launcher'],
  };

  config.set(configuration);
  console.log(JSON.stringify(config, null, 2));
};
