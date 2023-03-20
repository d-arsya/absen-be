import { Express } from 'express';
import { Application } from 'express-ws';

const penggunas: Set<any> = new Set();

export const broadcast = (msg: string) => {
  penggunas.forEach((pengguna) => {
    console.log("pengguna.readyState", pengguna.readyState)
    if (pengguna.readyState === 1) {
      pengguna.send(msg);
    }
  })
}

const wsRoutes = (app: Application & Express) => {
  app.ws('/ws', (ws, req) => {
    penggunas.add(ws)
    console.log('Pengguna terhubung');

    ws.on('message', (msg) => {
      console.log('Pesan diterima:', msg);
      ws.send(`Pesan diterima: ${msg}`)
    });

    ws.on('close', () => {
      penggunas.delete(ws)
      console.log('Pengguna terputus');
    });
  });
};

export default wsRoutes;
