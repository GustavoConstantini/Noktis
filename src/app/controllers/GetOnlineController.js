import { Op } from 'sequelize';
import User from '../models/User';

class GetOnlineController {
  async index(req, res) {
    const user = await User.findByPk(req.userId);

    const { sex } = user;

    let oppositeSex;

    if (sex === 'F') {
      oppositeSex = 'M';
    } else {
      oppositeSex = 'F';
    }

    let users = await User.findAll({ where: { [Op.and]: [{ online: true }, { sex: `${oppositeSex}` }] }, attributes: ['id', 'name', 'bio', 'sex', 'filename'] });

    users = users.map((index) => index.dataValues);

    return res.json({ users });
  }
}

export default new GetOnlineController();
