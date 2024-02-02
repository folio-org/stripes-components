module.exports = function (api) {
  api.cache(true);
 return {
  presets: [
    ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
    ['@babel/preset-flow', { all: true }],
    ['@babel/preset-react', {
      "runtime": "automatic"
    }],
    ['@babel/preset-typescript'],
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    ['@babel/plugin-transform-class-properties', { 'loose': true }],
    ['@babel/plugin-transform-private-methods', { 'loose': true }],
    ['@babel/plugin-transform-private-property-in-object', { 'loose': true }],
    // '@babel/plugin-transform-export-namespace-from',
    // '@babel/plugin-proposal-function-sent',
    // '@babel/plugin-transform-numeric-separator',
    // '@babel/plugin-proposal-throw-expressions',
    // '@babel/plugin-syntax-import-meta',

  ]
 }
}
;