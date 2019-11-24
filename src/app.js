import express from 'express';
import http from 'http';
import io from 'socket.io';
import ioConfig from './app/middlewares/io';
import routes from './routes';

import './database';

class App {
  constructor() {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = io(this.server).use(ioConfig);

    this.connectedUsers = {};
    this.io.on('connection', (socket) => {
      console.log('deu certo', socket.id);
      const { user } = socket.handshake.query;

      this.connectedUsers[user] = socket.id;
    });

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use((req, res, next) => {
      req.io = this.io;
      req.connectedUsers = this.connectedUsers;
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
