/*global require, module*/
const { override, useBabelRc } = require('customize-cra');

module.exports = override(
  useBabelRc()
);
