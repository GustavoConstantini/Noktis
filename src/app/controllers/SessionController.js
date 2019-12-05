import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import sequelize from 'sequelize';

import User from '../models/User';
import authConfig from '../../config/auth';

class SessionConstroller {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .email()
          .required(),
        password: Yup.string()
          .required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Falha na validacão' });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ where: { email }, include: ['profiles', 'connections'] });

      if (!user) {
        return res.status(400).json({ error: 'Usuário não encontrado' });
      }

      if (!(await user.checkPassword(password))) {
        return res.status(403).json({ error: 'Senha incorreta' });
      }

      const {
        id, profiles,
      } = user;

      const {
        name, age, sex, bio, filename,
      } = profiles;

      const { phone } = req.body;

      const date = Date.now();

      const token = jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      });

      let ip = req.header('x-forwarded-for') || req.connection.remoteAddress;

      if (ip.substr(0, 7) === '::ffff:') {
        ip = ip.substr(7);
      }

      const sessions = {
        ip,
        authorization: token,
        timestamp: date,
        phone,
      };

      await user.connections.update(
        { sessions: sequelize.fn('array_append', sequelize.col('sessions'), JSON.stringify(sessions)) },
        { where: { user_id: id } },
      );

      return res.json({
        user: {
          id,
          name,
          age,
          sex,
          bio,
          filename,
          email,
        },
        token,
      });
    } catch (error) {
      return res.status(400).json({ error: 'Erro no login' });
    }
  }
}

export default new SessionConstroller();
