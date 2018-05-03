module.exports = (config) => {
  let configuration = {
    browsers: ['ChromeDocker'],
  
    customLaunchers: {
      ChromeDocker: {
        base: 'Chrome',
        flags: [
           '--no-sandbox',
           '--disable-web-security'
        ]
      }
    }
  };
  config.set(configuration);
};

