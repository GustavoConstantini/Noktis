import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/User';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(403).json({ error: 'Não recebi nenhum token' });
    }

    const [, token] = authHeader.split(' ');

    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    req.userId = decoded.id;

    const user = await User.findOne({ where: { id: req.userId }, include: ['connections'] });

    if (user.connections.expire_token.includes(token)) {
      return res.status(403).json({ error: 'O usuário não está logado' });
    }

    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};
