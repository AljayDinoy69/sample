const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable extra symlink support
config.watcher.additionalExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// Resolve react-native-maps correctly
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-maps': require.resolve('react-native-maps'),
};

module.exports = config;
