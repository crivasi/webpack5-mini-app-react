# App en react hecha con Webpack 5 (sin create-react-app)

**Fuente (midudev):** https://www.youtube.com/watch?v=FMNuTj89RzU      

* Se inicia el proyecto con `npm init -y`
* Se crea la carpeta src y los archivos `utils.js` e `index.js`
* En index se importa `sayHi` (sin el js porque webpack lo agrega) que es una función que exporta utils
* Se instala _webpack_ y _webpack-cli_ con el comando `npm install --save-dev webpack webpack-cli`
* Se crea el comando `"build": "webpack --mode=development" en el package json` para que se ejecute webpack en el punto de entrada, que por defecto es `src/index.js` en modo desarrollo


* Al ejecutar el comando anterior, se crea una carpeta `dist` con un archivo `main.js`, donde quedan todos los scripts empaquetados en ese solo archivo. Si se corre el comando `node /dist/main.js` se ejecutará el `sayHi` de `utils.js` del ejemplo
* Para empezar a personalizar webpack, se crea un archivo `webpack.config.js` con `module.exports = {...}` dentro de las llaves va lo que se configura

* Ahora instalamos `react`con `npm install react react-dom -E` el -E es para que instale dependencias exactas sin `~` ni `^`
* Modificamos `index.js`para importar React y renderizar un componente
  ```
  import React from 'react';
  import ReactDOM from 'react-dom';

  import App from './App';

  ReactDOM.render(<App/>, document.getElementById('root'));
  ```
  y creamos el `App.js` para el componente `App`
  ```
  import React from 'react';

  const App = () => <h1>Soy App componente</h1>

  export default App;
  ```

* Si ejecutamos `npm run build` nos va a decir que hay un error en un token, y esto es porque webpack no sabe cómo procesar `<App/>` porque es JSX, por lo tanto debemos instalar un loader que nos ayude a que entienda eso al momento de empaquetar, para ello, modificamos el archivo `webpack.config.js` y agregamos en el objeto de configuración las module y rules con los presets de babel, quedaría algo así:
  ```
  module.exports = {
    ...

    module: {
      rules: [
        {
          test: /\.js$/, // para que evalúe lo que termina en js
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react']
          }
        }
      ]
    }
  }
  ```

* Ahora instalamos el _@babel/core_ (es el núcleo de babel) _babel-loader_ y _@babel/preset-react_ como dependencias de desarrollo con el `--save-dev` con `npm install @babel/core babel-loader @babel/preset-react --save-dev`

**_Nota:_** Usar el `import react from 'react'` para importar react al principio de cada componente, ya está desaconsejado y puede ser mala práctica; para no tener que hacerlo, se puede configurar el preset de babel, agregándole un runtime automático:
```
...

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
```
y ya se podría eliminar la línea de `import react from 'react'` de los archivos js y correr el `npm run build` y ver que funciona

* El archivo de la config del webpack puede refactorizarse al tener de pronto las rules en  una constante o algo por el estilo ej (este es todo el contenido hasta ahora del `webpack.config.js`):
  ```
  const path = require('path');

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
  const rules = [rulesForJavascript];

  module.exports = {
    // entry: './src/index.js',
    output: {
      // hay que decirle la ruta absoluta para el path (para ser compatible con los \ de rutas de windows, usamos el path de node)
      path: path.resolve(__dirname, 'build')
    },
    module: {
      rules
    }
  };
  ```

* Ahora creamos un `index.html` dentro de la carpeta `build` con un elemento de `id="root"` e importando el script del `main.js` para ver nuestra app renderizada
* Después de esto ejecutamos el servor de npx a la carpeta build `npx servor build` para que se encargue de montar un servidor y renderizar el `index.html`

**_Nota:_** Tener en cuenta que si se hace un cambio en algún componente, se debe correr de nuevo el `npm run build` y luego el `npx servor build` para poder visualizar los cambios.

* Ahora para poner estilos a nuestra app, podríamos tener la etiqueta `style` en nuestro `index.html` o importar un archivo de estilos con `<link rel="stylesheet" href="styles.css">` peeero, es mejor importar los estilos dentro de cada componente así:
  ```
  import './styles.css'; // con el loader style-loader

  const App = () => <h1>Soy el App componente</h1>;

  export default App;
  ```
  para ello, necesitamos usar el loader `style-loader` dentro de la config de webpack y además el `css-loader` que permite que webpack reconozca los importes dentro de nuestros css como cuando hacemos un `background-image: url('./....png')`, ese tipo de require, entonces los instalamos `npm install style-loader css-loader --save-dev`. Así que nuestro webpack quedaría así:
  ```
  const path = require('path');

  const rulesForStyles = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }
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

  module.exports = {
    // entry: './src/index.js',
    output: {
      // hay que decirle la ruta absoluta para el path (para ser compatible con los \ de rutas de windows, usamos el path de node)
      path: path.resolve(__dirname, 'build')
    },
    module: {
      rules
    }
  };
  ```

* Existe un plugin que vale la pena agregar a la config del webpack y es el `html-webpack-plugin`, con el fin de que webpack sea el que se encargue de generar el archivo `index.html` por si por ejemplo al archivo de entrada (main.js) se le cambia el nombre o si queremos que cargue más archivos js. Entonces ejecutamos `npm install html-webpack-plugin --save-dev` y lo agregamos a la config de webpack:
  ```
  ...

  output: {
    ...
  },
  plugins: [
    new HTMLWebpackPlugin({ template: 'src/index.html' })
  ],

  ...
  ```
  Luego borramos vamos a `src` y creamos un archivo `index.html` pero que no importe ningún js, pues cuando webpack lo cree en la carpeta build, le agregará el script de entrada.


* Ahora pasamos a generar un entorno de desarrollo para que se monte el server y se actualicen los cambios automáticamente, utilizando el webpack serve, para ello instalamos `npm install webpack-dev-server --save-dev` y agregamos el comando al package json:
```
"scripts": {
  ...

  "dev": "webpack serve --mode=development"

  ...
}
```
Luego corremos `npm run dev`

* A el dev server de webpack se le puede añadir configuración, por ejemplo en el config de webpack podemos agregar:
  ```
  ...

  module: { rules },
  devServer: {
    open: true, // abre el navegador al terminar de compilar
    port: 3000
  }
  ```

* Ahora vamos a hacer un pequeño counter, y hacer que sea más fácil identificar los errores con sorucemaps de webpack, modificamos el `App.js` y quedaría así:
  ```
  import { useState } from 'react';

  import './styles.css';

  const App = () => {
    const [counter, setCounter] = useState(0);
    const [values, setValues] = useState();

    const handleClick = () => {
      setCounter(counter + 1);
      setValues(values.concat(counter));
    }

    return (
      <div>
        <h1>Hola!!</h1>
        <h3>Counter: {counter}</h3>
        <button onClick={handleClick}>
          +1
        </button>
      </div>
    )
  }

  export default App;
  ```
  Si vemos en la consola del navegador, veremos muchos errores porque estamos intentando hacer un `concat` a `values` que no está inicializado como `[]`, pero ver esto es difícil, entonces hagamos que webpack nos muestre dónde está el error.
  Agregamos el `devtool` en el config de webpack:
  ```
  ...
  module: ...,
  ...

  devtool: 'source-map'
  ```
  al correr de nuevo `npm run dev` se demorará un poco más porque es costoso en tiempo y computación, pero ayudará a debuggear mostrando exactamente dónde está el error

* Cambiemos ahora el mode del comando `build` en el `package.json a production` para que webpack minifique el código:
`"build": "webpack --mode=production"`

* Ahora vamos a diferenciar el modo en el que estamos ejecutando webpack, algo que nos puede servir para hashear los archivos js, para esto, cambiamos el objeto que se exporta en la config de webpack por una función que devuelva ese objeto y reciba los argumentos `env` (no es el entorno jeje) y `argv` que allí es donde está el `mode`, así que el webpack.config.js quedaría así:
  ```
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const path = require('path');

  const rulesForStyles = {
    test: /\.css$/,
    use: ['style-loader', 'css-loader']
  }
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
        // con [name].[contenthash].js se están hasheando los archivos (esto sirve para las caché)
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
    }

    if (!isProduction) {
      // para generar los source map en dev y poder debuggear mejor
      config.devtool = 'source-map';
    }

    return config;
  }
  ```