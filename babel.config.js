module.exports = {
  presets: [require.resolve('@babel/preset-env'), require.resolve('@babel/preset-typescript')],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { corejs: { version: 3, proposals: true } },
    ],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
  ],
};
