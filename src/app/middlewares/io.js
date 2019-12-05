import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User';

import authConfig from '../../config/auth';

export default async (socket, next) => {
  try {
    if (!(socket.handshake.query.token || socket.handshake.query.user)) {
      return next(new Error('falha ao validar'));
    }

    const decoded = await promisify(jwt.verify)(socket.handshake.query.token, authConfig.secret);

    socket.userId = decoded.id;

    const user = await User.findOne({ where: { id: socket.userId }, include: ['connections'] });

    if (user.connections.expire_token.includes(socket.handshake.query.token)) {
      return next(new Error('O usuário não está logado'));
    }

    return next();
  } catch (error) {
    return next(new Error('falha ao validar'));
  }
};
