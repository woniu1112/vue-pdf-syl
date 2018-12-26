var path = require('path');
module.exports = {
  entry:'./src/lib/index.js',
  output:{
    path:path.join(__dirname,'./dist'),
    filename:'vue-pdf-syl.js',
    libraryTarget: "umd",  //一套完整的规范 cmd  amd
    library: 'VuePdfSyl'  //库的名字
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        loader:'babel-loader',
        include:path.join(__dirname,'src'),
        exclude:/node_modules/,
      },
      {
        test: /\.sass$/,
        loaders: ['style', 'css', 'sass']
      },
      {
        loader:"postcss-loader",
        options: {           // 如果没有options这个选项将会报错 No PostCSS Config found
          plugins: (loader) => [
            require('autoprefixer')(), //CSS浏览器兼容
          ]
        }
      },
      {
        test:/\.vue$/,
        loader:'vue-loader',
        include:path.join(__dirname,'src'),
        exclude:/node_modules/,
        options:{
          loaders:{
            scss:'style-loader!css-loader!postcss-loader!sass-loader'
          },

        }
      }
    ]
  },
  plugins: [
  ]
}