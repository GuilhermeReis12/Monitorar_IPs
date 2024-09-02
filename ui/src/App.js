import React from 'react';
import ServerMonitor from './components/ServerMonitor';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Monitoramento de Servidores (IPs)</h1>
        <ServerMonitor />
      </header>
    </div>
  );
}

export default App;
