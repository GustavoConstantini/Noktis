/* eslint-disable consistent-return */
import { Op } from 'sequelize';
import User from '../models/User';

class GetOnlineController {
  async index(req, res) {
    if (req.user != req.userId) {
      return res.status(400).json({ error: 'falha ao passar os parametros para o socket' });
    }

    const user = await User.findByPk(req.userId);

    user.socket = req.socketIo;

    await user.save();

    const { sex } = user;

    let oppositeSex;

    if (sex === 'F') {
      oppositeSex = 'M';
    } else {
      oppositeSex = 'F';
    }

    if (user.likes === null && user.dislikes === null) {
      const users = await User.findAll({
        where: {
          [Op.and]: [{ online: true }, { sex: `${oppositeSex}` }],
        },
        attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename'],
      });

      const usersValues = users.map((index) => index.dataValues);

      return res.json({ usersValues });
    }

    if (user.likes !== null && user.dislikes === null) {
      const users = await User.findAll({
        where: {
          [Op.and]: [{ id: { [Op.notIn]: user.likes } }, { online: true }, { sex: `${oppositeSex}` }],
        },
        attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename'],
      });

      const usersValues = users.map((index) => index.dataValues);

      return res.status(200).json({ usersValues });
    }

    if (user.likes === null && user.dislikes !== null) {
      const users = await User.findAll({
        where: {
          [Op.and]: [{ id: { [Op.notIn]: user.dislikes } }, { online: true }, { sex: `${oppositeSex}` }],
        },
        attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename'],
      });

      const usersValues = users.map((index) => index.dataValues);

      return res.status(200).json({ usersValues });
    }

    if (user.likes !== null && user.dislikes !== null) {
      const users = await User.findAll({
        where: {
          [Op.and]: [{ id: { [Op.notIn]: user.likes } }, { id: { [Op.notIn]: user.dislikes } }, { online: true }, { sex: `${oppositeSex}` }],
        },
        attributes: ['id', 'name', 'birth_timestamp', 'bio', 'sex', 'filename'],
      });

      const usersValues = users.map((index) => index.dataValues);

      return res.status(200).json({ usersValues });
    }
  }
}

export default new GetOnlineController();
