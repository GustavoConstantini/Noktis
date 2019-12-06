import { Op } from 'sequelize';
import User from '../models/User';
import Profile from '../models/Profile';

class GetMatchesController {
  async index(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['choices'] });

      const userFilter = await User.findAll({
        where: { id: { [Op.in]: user.choices.matches } },
        attributes: { exclude: ['createdAt', 'updatedAt', 'password_hash', 'email'] },
        include: [
          {
            model: Profile,
            as: 'profiles',
            attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'UserId', 'user_id'] },
          }],
      });

      return res.status(200).json({ userFilter });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao procurar a lista de matches' });
    }
  }
}

export default new GetMatchesController();
