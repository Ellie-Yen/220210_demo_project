// Cannot use import statement outside a module
// use require here
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');

// proxy setup steps:
// https://webpack.js.org/configuration/dev-server/#devserverproxy
// https://github.com/shellscape/webpack-plugin-serve/blob/master/recipes/proxies.md

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'static/js/[name].[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.tsx|\.ts|\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [
    new Serve({
      middleware: (app, builtins) => {
        app.use(builtins.proxy('/api', {
          target: 'https://od.moi.gov.tw/'
        }))
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[hash].css',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://od.moi.gov.tw/',
        changeOrigin: true,
      },
    },
    host: "localhost",
    port: 8000,
    https: true,
    allowedHosts: [
      'ellie-demo-project-220224.herokuapp',
      'ellie-yen.github.io'
    ],
    historyApiFallback: true,
  }
};