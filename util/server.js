var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('../webpack.config');

if (process.env.NODE_ENV !== 'production'){
  config.entry.index.unshift("webpack-dev-server/client?http://0.0.0.0:8080", 'webpack/hot/only-dev-server');
}

var server = new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: process.env.NODE_ENV !== 'production',
  historyApiFallback: true,
  contentBase:'/',
  stats: {
    colors: true,
    chunkModules: false,
    chunks: false,
    assets: false,
    hash: false,
    version: false
  }
});

server.listen(8080, '0.0.0.0', function (err) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at 0.0.0.0:8080');
});