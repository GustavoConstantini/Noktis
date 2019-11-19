/* eslint-disable no-console */
import sequelize from 'sequelize';
import User from '../models/User';

class LikeController {
  async store(req, res) {
    const { id } = req.body;

    const loggedUser = await User.findByPk(req.userId);

    try {
      const { dataValues: targetUser } = await User.findOne({ where: { id }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt'] } });

      if (targetUser.likes !== null) {
        if (targetUser.likes.includes(loggedUser.id)) {
          console.log('Deu MATCH');
        }
      }

      await loggedUser.update(
        { likes: sequelize.fn('array_append', sequelize.col('likes'), id) },
        { where: { id: req.userId } },
      );
    } catch (error) {
      return res.status(404).json({ error: 'O usuario nao existe' });
    }

    return res.status(200).json({ ok: true });
  }
}

export default new LikeController();
