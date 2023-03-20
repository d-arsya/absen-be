import { Express } from 'express';
import { Application } from 'express-ws';

const clients: Set<any> = new Set();

export const broadcast = (msg: string) => {
  clients.forEach((client) => {
    console.log("client.readyState", client.readyState)
    if (client.readyState === 1) {
      client.send(msg);
    }
  })
}

const wsRoutes = (app: Application & Express) => {
  app.ws('/ws', (ws, req) => {
    clients.add(ws)
    console.log('Pengguna terhubung');

    ws.on('message', (msg) => {
      console.log('Pesan diterima:', msg);
      ws.send(`Pesan diterima: ${msg}`)
    });

    ws.on('close', () => {
      clients.delete(ws)
      console.log('Pengguna terputus');
    });
  });
};

export default wsRoutes;
