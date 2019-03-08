module.exports = function babelConfig(api) {
  api.cache(true)

  // Jest auto sets NODE_ENV = 'test'
  const isInTest = String(process.env.NODE_ENV) === 'test'

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: isInTest ? 'commonjs' : false,
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/react',
  ]
  const plugins = [
    // 'syntax-dynamic-import',
    // 'transform-class-properties',
    // ['@babel/plugin-proposal-decorators', { legacy: true }],
  ]

  return {
    presets,
    plugins,
  }
}
