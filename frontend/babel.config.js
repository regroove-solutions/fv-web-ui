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
    @babel/react'
  ]
  const plugins = [
    // 'transform-class-properties', // This breaks Jest & Cypress
    'syntax-dynamic-import',
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    'dynamic-import-node',
  ]

  return {
    presets,
    plugins,
  }
}
