/**
 * @type {import('@react-native-community/cli-types').UserDependencyConfig}
 */
module.exports = {
  dependency: {
    platforms: {
      android: {
        cmakeListsPath: 'generated/jni/CMakeLists.txt',
        cxxModuleCMakeListsModuleName: 'react-native-quick-base64',
        cxxModuleCMakeListsPath: 'CMakeLists.txt',
        cxxModuleHeaderName: 'QuickBase64Impl'
      }
    }
  }
}
