const path = require('path');
const slsw = require('serverless-webpack');
const os = require('os')
// var nodeExternals = require('webpack-node-externals')
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

// const smp = new SpeedMeasurePlugin();

console.log('CPUs: ', os.cpus())
const threadNumber = !!~os.cpus()[0].model.indexOf('i7-4700HQ')
                      ? (os.cpus().length) / 2 - 1
                      : Math.max(1, (os.cpus().length - 1))

module.exports = {
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  entry: slsw.lib.entries,
  // externals: [nodeExternals()],
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      // { 
      //   test: /\.tsx?$/, 
      //   exclude: /node_modules/, 
      //   use: {
      //     loader: 'ts-loader',
      //     // options: {
      //     //   transpileOnly: true
      //     // }
      //   } 
      // },
      { 
        test: /\.tsx?$/,
        exclude: /node_modules/, 
        use: {
          loader: 'happypack/loader'
        }
      },
      { 
        test: /\.(png|jpg|bmp|gif|svg)$/, 
        exclude: /node_modules/, 
        use: {
                loader: 'file-loader',
                options: {
                  limit: 8192,
                  name: '[name].[ext]',
                  outputPath: 'images/'
                }
              }
      },
    ],
  },
  plugins: [
    new HardSourceWebpackPlugin(),
    new HappyPack({
      threads: threadNumber,
      use: [
        {
          path: 'ts-loader',
          query: {
            happyPackMode: true   // This implicitly sets *transpileOnly* to true
          }
        }
      ]
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true
        }
      }
    }),
  ],
  optimization: {
    minimize: false,    // When packaging on Travis CI, it would crash if set to true
    minimizer: [
      new TerserPlugin({
        cache: true,
  //       // parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production

      }),
    ],
  }
};
