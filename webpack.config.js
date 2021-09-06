const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const rulesForStyles = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
};
const rulesForJavascript = {
  test: /\.js$/, // para que evalúe lo que termina en js
  loader: 'babel-loader',
  options: {
    presets: [
      [
        '@babel/preset-react',
        {
          runtime: 'automatic' // 'classic' -> el classic quiere decir que necesita que se ponga el import react en los componentes
        }
      ]
    ]
  }
};

const rules = [rulesForJavascript, rulesForStyles];

module.exports = (env, argv) => {
  const { mode } = argv;
  const isProduction = mode === 'production';

  const config = {
    // entry: './src/index.js',
    output: {
      // con [name].[contenthash].js se están hasheando los archivos (esto sirve para las cache)
      filename: isProduction ? '[name].[contenthash].js' : 'main.js',
      // hay que decirle la ruta absoluta para el path (para ser compatible con los \ de rutas de windows, usamos el path de node)
      path: path.resolve(__dirname, 'build')
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'src/index.html' })
    ],
    module: {
      rules
    },
    devServer: {
      open: true, // abre el navegador al terminar de compilar
      port: 3000,
      compress: true
    }
  };

  if (!isProduction) {
    config.devtool = 'source-map';
  }

  return config;
}