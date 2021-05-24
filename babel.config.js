module.exports = {
  presets: [
    require.resolve('@babel/preset-env', {
      targets: {
        node: '12',
      },
      useBuiltIns: 'usage',
    }),
    // require.resolve('@babel/preset-react'),
    require.resolve('@babel/preset-typescript'),
  ],
  plugins: [
    // [
    //   require.resolve('@babel/plugin-transform-runtime'),
    //   { corejs: { version: 3, proposals: true } },
    // ],
    // [
    //   require.resolve('@babel/plugin-proposal-class-properties'),
    //   { loose: false },
    // ],
  ],
};
