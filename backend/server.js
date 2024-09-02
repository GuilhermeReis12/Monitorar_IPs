require('dotenv').config();
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const ping = require('ping');

const serverIps = process.env.SERVER_IPS.split(',');

const servers = serverIps.map((ip, index) => ({
  id: index + 1,
  ip,
  status: 'offline',
}));

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const checkServerStatus = async (server) => {
  try {
    const res = await ping.promise.probe(server.ip);
    server.status = res.alive ? 'online' : 'offline';
  } catch (error) {
    server.status = 'offline';
  }
};

setInterval(() => {
  servers.forEach(checkServerStatus);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(servers));
    }
  });
}, 5000);

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado');
  ws.send(JSON.stringify(servers));

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

server.listen(3001, () => {
  console.log('Servidor WebSocket rodando na porta 3001');
});
