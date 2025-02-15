import { message } from './message';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>{message}</h1>
      </header>
    </div>
  );
}

// eslint-disable-next-line no-default-export
export default App;
