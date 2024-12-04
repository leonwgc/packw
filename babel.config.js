module.exports = {
  presets: [
    [require.resolve('@babel/preset-env'), { loose: true }],
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      { corejs: { version: 3, proposals: true } },
    ],
  ],
};
