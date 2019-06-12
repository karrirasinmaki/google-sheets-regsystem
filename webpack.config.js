/**
 * @file webpack.config.js
 * @author Amit Agarwal
 * @email amit@labnol.org
 *
 * Google Apps Script Starter Kit
 * https://github.com/labnol/apps-script-starter
 */

const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const GasPlugin = require('gas-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { version } = require('./package.json');

const mode = 'none'; // or production

const tmp = path.resolve(__dirname, 'tmp');
const src = path.resolve(__dirname, 'src');
const destination = path.resolve(__dirname, 'dist');

module.exports = {
  mode,
  context: __dirname,
  // entry: `${src}/main.js`,
  entry: `${tmp}/bundle.js`,
  output: {
    filename: `code-${version}.js`,
    path: destination,
    libraryTarget: 'this'
  },
  resolve: {
    extensions: ['.js']
  },
  optimization: {
    minimizer: [
      new UglifyJSPlugin({
        uglifyOptions: {
          ie8: true,
          warnings: false,
          mangle: false,
          compress: {
            properties: false,
            warnings: false,
            drop_console: false
          },
          output: {
            beautify: true
          }
        }
      })
    ]
  },
  module: {
    rules: [
      /*
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          cache: true,
          failOnError: false,
          fix: true
        }
      },
      */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          "presets": ["@dreipol/babel-preset-google-apps-script"]
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: `${src}/**/*.html`,
        flatten: true,
        to: destination
      },
      {
        from: `${src}/appsscript.json`,
        to: destination
      },
      {
        from: `./.secrets.js`,
        to: destination
      }
    ]),
    new GasPlugin({
      comments: false
    })
  ]
};
