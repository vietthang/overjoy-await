const path = require('path')
const webpackNodeExternals = require('webpack-node-externals')
const packageConfig = require('../package.json')

module.exports = {
  devtool: 'source-map',
  target: 'node',
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/
      }
    ]
  },
  resolve: {
    root: path.resolve('.'),
    extensions: ['', '.js', '.json']
  },
  entry: 'src/index.js',
  output: {
    path: `${__dirname}/../lib`,
    filename: 'library.min.js',
    library: packageConfig.name,
    libraryTarget: 'umd'
  },
  externals: [
    webpackNodeExternals()
  ]
}
