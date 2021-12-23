"use strict";

const webpack = require("webpack");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const { options } = require("less");

const NODE_ENV = process.env.NODE_ENV || "development";
const PATHS = {
  src: path.resolve(__dirname) + "/assets/",
  dist: path.resolve(__dirname) + "/public/",
  assets: "assets/",
};

const isDev = NODE_ENV === "development";

const resolveAssetsPath = (resourcePath) => {
  const pathSplit = resourcePath.split("/").reverse();
  const assetIndex = pathSplit.findIndex((element) => element === "assets");
  const path = pathSplit.slice(0, assetIndex);
  return `/${path.reverse().join("/")}`;
};

const progressHandler = (percentage, message, ...args) => {
  console.info(`${Math.round(percentage * 100)}%`, message, ...args);
};

module.exports = {
  mode: NODE_ENV,
  entry: {
    main: ["babel-polyfill", PATHS.src + "/js/main"],
    styles: PATHS.src + "/less/main",
  },
  output: {
    filename: PATHS.assets + "[name].[hash].js",
    chunkFilename: PATHS.assets + "[id].[chunkhash].js",
    path: PATHS.dist,
    library: "[name]",
    publicPath: "/",
  },
  resolve: {
    extensions: [".js", ".less", ".css"],
  },
  optimization: {
    minimize: !isDev,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: !isDev,
          },
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: "vendors",
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { url: false },
          },
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|jpg)$/,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath(url, resourcePath) {
            return resolveAssetsPath(resourcePath);
          },
          publicPath(url, resourcePath) {
            return resolveAssetsPath(resourcePath);
          },
        },
      },
    ],
  },
  watch: NODE_ENV === "development",
  watchOptions: {
    aggregateTimeout: 100,
  },
  devtool: false,
  stats: {
    entrypoints: false,
    children: false,
  },
  plugins: [
    new webpack.ProgressPlugin(progressHandler),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(NODE_ENV),
    }),
    new MiniCssExtractPlugin({
      filename: PATHS.assets + "[name].[hash].css",
      chunkFilename: PATHS.assets + "[id].[hash].css",
    }),
    new CleanWebpackPlugin({
      dry: false,
      verbose: false,
      cleanStaleWebpackAssets: false,
      protectWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: ["**/assets/*", "**/img/*"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: PATHS.src + "img",
          to: PATHS.dist + "img",
        },
      ],
    }),
    new WebpackManifestPlugin({}),
    new webpack.SourceMapDevToolPlugin({
      filename: PATHS.assets + "[name].[hash].js.map",
      exclude: ["vendors.js"],
      fileContext: "public",
    }),
  ],
};
