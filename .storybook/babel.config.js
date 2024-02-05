// Storybook v7 requires that projects now bring their own babel configuration. This file is a subset of the configuration found in
// stripes-webpack, containing only the portions we need for components.

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
  ]
 }
}
;