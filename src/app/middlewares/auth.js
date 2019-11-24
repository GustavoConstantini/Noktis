import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ error: 'Não recebi nenhum token' });
  }

  const [, token] = authHeader.split(' ');

  try {
    console.log(await promisify(jwt.verify)(token, authConfig.secret));

    req.userId = decoded.id;

    return next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
};
