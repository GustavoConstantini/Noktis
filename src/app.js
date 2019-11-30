import express from 'express';
import http from 'http';
import io from 'socket.io';
import ioConfig from './app/middlewares/io';
import onlineConnection from './app/functions/onlineConnection';
import onlineDisconnection from './app/functions/onlineDisconnect';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = io(this.server).use(ioConfig);

    this.io.on('connection', onlineConnection);
    this.io.on('disconnection', onlineDisconnection);

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use((req, res, next) => {
      req.io = this.io;
      return next();
    });
    this.app.use(express.json());
    this.app.use('/uploads', express.static('uploads'));
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App();
