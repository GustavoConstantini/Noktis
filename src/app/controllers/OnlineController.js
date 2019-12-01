import { Op } from 'sequelize';
import User from '../models/User';

import jsonEditor from '../functions/ jsonEditor';

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

      const users = await User.findAll({
        where: {
          [Op.and]: [{ id: { [Op.notIn]: user.likes } }, { id: { [Op.notIn]: user.dislikes } }, { online: true }, { sex: `${oppositeSex}` }],
        },
        attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename', 'latitude', 'longitude'],
      });

      const usersValues = jsonEditor(users, user.latitude, user.longitude);

      return res.status(200).json({ usersValues });
    } catch (error) {
      return res.status(400).json({ error: 'Erro em buscar os usuários' });
    }
  }
}

export default new GetOnlineController();
