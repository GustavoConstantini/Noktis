import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (socket, next) => {
  if (!(socket.handshake.query.token || socket.query.user)) {
    next(new Error('falha ao validar'));
  }
  try {
    const decoded = await promisify(jwt.verify)(socket.handshake.token, authConfig.secret);

    socket.decoded = decoded;

    next();
  } catch (error) {
    next(new Error('falha ao validar'));
  }
};
