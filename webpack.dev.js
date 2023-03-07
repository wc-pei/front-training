const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const outputFile = '[name]';

module.exports = merge(common(outputFile), {
  mode: 'development',
  devtool: 'source-map',

});