var path = require('path');

module.exports = {
  entry: './src/js/index.js',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.py$/,
        loader: 'py-loader'
      }
    ]
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/js/components'),
      json: path.resolve(__dirname, 'src/json'),
      scripts: path.resolve(__dirname, 'src/js/scripts'),
      views: path.resolve(__dirname, 'src/js/views')
    },
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist'
  }
};
