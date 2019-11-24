import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (socket, next) => {
  console.log(socket.handshake.query.token, '\n', socket.handshake.query.user);
  if (!(socket.handshake.query.token || socket.handshake.query.user)) {
    console.log('erro ao passar os parametros');
    return next(new Error('falha ao validar'));
  }
  try {
    const decoded = await promisify(jwt.verify)(socket.handshake.token, authConfig.secret);

    socket.decoded = decoded;

    return next();
  } catch (error) {
    console.log(error, '\n erro do catch');
    return next(new Error('falha ao validar'));
  }
};
