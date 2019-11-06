/*global require, module, __dirname*/
const { override, fixBabelImports, useEslintRc } = require('customize-cra');
const path = require('path');

module.exports = function override(config) {
  return config;
};

module.exports = override(
  fixBabelImports('import', {
     libraryName: 'antd',
     libraryDirectory: 'es',
     style: 'css',
   }),
  useEslintRc(path.resolve(__dirname, '.eslintrc.js'))
);
