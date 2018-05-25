module.exports = (config) => {
  // Turn on coverage reports if --coverage option set
  if (config.coverage) {
    config.coverageReporter = {
      dir: 'artifacts/coverage',
      subdir: '.',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', file: 'lcov.txt' }
      ],
      includeAllSources: true
    };
    config.reporters.push('coverage');
    config.plugins.push('karma-coverage');
  }
};
