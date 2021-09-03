import { useState } from 'react';

import './styles.css';

const App = () => {
  const [counter, setCounter] = useState(0);
  const [values, setValues] = useState([]);

  const handleClick = () => {
    setCounter(counter + 1);
    setValues(values.concat(counter));
  }

  return (
    <div>
      <h1>Hola!!</h1>
      <h3>Counter valor: {counter}</h3>
      <button onClick={handleClick}>
        +1
      </button>
      <h4>Histórico: {values.join(', ')}</h4>
    </div>
  )
}

export default App;