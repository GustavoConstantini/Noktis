import { Op } from 'sequelize';
import User from '../models/User';

import distancia from '../functions/distancia';

class GetOnlineController {
  async index(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      let oppositeSex;

      if (user.sex === 'F') {
        oppositeSex = 'M';
      } else {
        oppositeSex = 'F';
      }

      if (user.likes === null && user.dislikes === null) {
        const users = await User.findAll({
          where: {
            [Op.and]: [{ online: true }, { sex: `${oppositeSex}` }],
          },
          attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename', 'latitude', 'longitude'],
        });

        const usersValues = distancia(users, user.latitude, user.longitude);

        return res.json({ usersValues });
      }

      if (user.likes !== null && user.dislikes === null) {
        const users = await User.findAll({
          where: {
            [Op.and]: [{ id: { [Op.notIn]: user.likes } }, { online: true }, { sex: `${oppositeSex}` }],
          },
          attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename', 'latitude', 'longitude'],
        });

        const usersValues = distancia(users, user.latitude, user.longitude);

        return res.status(200).json({ usersValues });
      }

      if (user.likes === null && user.dislikes !== null) {
        const users = await User.findAll({
          where: {
            [Op.and]: [{ id: { [Op.notIn]: user.dislikes } }, { online: true }, { sex: `${oppositeSex}` }],
          },
          attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename', 'latitude', 'longitude'],
        });

        const usersValues = distancia(users, user.latitude, user.longitude);

        return res.status(200).json({ usersValues });
      }

      if (user.likes !== null && user.dislikes !== null) {
        const users = await User.findAll({
          where: {
            [Op.and]: [{ id: { [Op.notIn]: user.likes } }, { id: { [Op.notIn]: user.dislikes } }, { online: true }, { sex: `${oppositeSex}` }],
          },
          attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename', 'latitude', 'longitude'],
        });

        const usersValues = distancia(users, user.latitude, user.longitude);

        return res.status(200).json({ usersValues });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Erro em buscar os usuário' });
    }
    return this;
  }
}

export default new GetOnlineController();
