const path = require('path')
const { getDefaultConfig } = require('@react-native/metro-config')

async function getMetroConfig() {
  const { withMetroConfig } = await import('react-native-monorepo-config')
  const root = path.resolve(__dirname, '..')

  return withMetroConfig(getDefaultConfig(__dirname), {
    root,
    dirname: __dirname
  })
}

module.exports = (async () => await getMetroConfig())()
