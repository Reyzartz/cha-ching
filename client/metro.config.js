const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const root = __dirname;

const config = getDefaultConfig(__dirname);

config.watchFolders = [root];

config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")];

config.resolver.extraNodeModules = {
  "@": path.resolve(root, "src"),
};

module.exports = withNativeWind(config, { input: "./styles/global.css" });
