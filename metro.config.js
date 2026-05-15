const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Esta línea le dice a Metro que acepte archivos .mjs
config.resolver.sourceExts.push('mjs');

module.exports = config;