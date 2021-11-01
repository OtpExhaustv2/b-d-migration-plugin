const path = require('path');

module.exports = {
    entry: "./src/index.js",
    mode: "development",
    output: {
      path: path.resolve(__dirname, "./dist"),
      publicPath: "/dist/",
      filename: "main.js"
    },
    resolve:{
      extensions: [".js"]
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 9000,
    },
  }