const path = require('path');
const slsw = require('serverless-webpack');
const os = require('os')
// var nodeExternals = require('webpack-node-externals')
// const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HappyPack = require('happypack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// const smp = new SpeedMeasurePlugin();

console.log('Mode: ', slsw.lib.webpack.isLocal ? 'development' : 'production')
console.log('CPUs: ', os.cpus().length)

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
      // { test: /\.tsx?$/, loader: 'ts-loader' },
      // { 
      //   test: /\.tsx?$/, 
      //   exclude: /node_modules/, 
      //   use: {
      //     loader: 'ts-loader',
      //     options: {
      //       transpileOnly: true
      //     }
      //   } 
      // },
      { 
        test: /\.tsx?$/,
        exclude: /node_modules/, 
        use: {
          loader: 'happypack/loader'
          // loader: 'ts-loader',
          // options: {
          //   // transpileOnly: true,
          //   happyPackMode: true
          // }
        }
      },
      
      // { test: /\.tsx?$/, use: 'happypack/loader' },
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
  //   new HardSourceWebpackPlugin()
    new HappyPack({
      threads: $THREAD_NUMBER && 1,
      threads: Math.max(1, (os.cpus().length)),
      // threads: (os.cpus().length > 4) ? 3 : os.cpus().length,
      // threads: 4,
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
    })
  ]
};
