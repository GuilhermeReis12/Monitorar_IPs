import React, { useEffect, useState } from 'react';
import './ServerMonitor.css';

const ServerMonitor = () => {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3001');

    ws.onmessage = (event) => {
      const serverData = JSON.parse(event.data);
      setServers(serverData);
    };

    ws.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    return () => {
      ws.close();
    };
  }, []);

  const onlineServers = servers.filter(server => server.status === 'online');
  const offlineServers = servers.filter(server => server.status === 'offline');

  return (
    <div className="server-monitor">
      <h2>Monitoramento de Servidores</h2>
      <div className="status-summary">
        <p className="online-count">🟢 Online: {onlineServers.length}</p>
        <p className="offline-count">🔴 Offline: {offlineServers.length}</p>
      </div>
      <div className="server-lists">
        <div className="server-list online">
          <h3>Servidores Online</h3>
          <ul>
            {onlineServers.map(server => (
              <li key={server.id}>
                {server.ip} - 🟢 Online
              </li>
            ))}
          </ul>
        </div>
        <div className="server-list offline">
          <h3>Servidores Offline</h3>
          <ul>
            {offlineServers.map(server => (
              <li key={server.id}>
                {server.ip} - 🔴 Offline
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ServerMonitor;
