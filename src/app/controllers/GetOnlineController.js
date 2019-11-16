import { Op } from 'sequelize';
import Users from '../models/User';

class GetOnlineController {
  async store(req, res) {
    const user = await Users.findByPk(req.userId);

    const { sex } = user;

    let oppositeSex;

    if (sex === 'F') {
      oppositeSex = 'M';
    } else {
      oppositeSex = 'F';
    }

    let users = await Users.findAll({ where: { [Op.and]: [{ online: true }, { sex: `${oppositeSex}` }] }, attributes: ['name', 'bio', 'sex', 'filename', 'latitude', 'longitude'] });

    users = users.map((index) => index.dataValues);

    return res.json({ users });
  }
}

export default new GetOnlineController();
