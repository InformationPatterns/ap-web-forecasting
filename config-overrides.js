/*global require, module*/
const { override, useBabelRc } = require('customize-cra');
const path = require("path");

module.exports = override(
  useBabelRc(path.resolve(__dirname, ".eslintrc.json"))
);
