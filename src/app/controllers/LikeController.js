import sequelize from 'sequelize';
import User from '../models/User';

class LikeController {
  async store(req, res) {
    try {
      const { id } = req.body;

      const loggedUser = await User.findByPk(req.userId);

      const targetUser = await User.findByPk(id);

      const { dataValues: loggedUserFilter } = await User.findOne({ where: { id: req.userId }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt', 'matches', 'likes', 'dislikes', 'latitude', 'longitude', 'socket'] } });

      const { dataValues: targetUserFilter } = await User.findOne({ where: { id }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt', 'matches', 'likes', 'dislikes', 'latitude', 'longitude', 'socket'] } });

      if (targetUser.likes.includes(loggedUser.id)) {
        if (loggedUser.socket) {
          req.io.to(loggedUser.socket).emit('match', targetUserFilter);
        }

        if (targetUser.socket) {
          req.io.to(targetUser.socket).emit('match', loggedUserFilter);
        }

        await loggedUser.update(
          { matches: sequelize.fn('array_append', sequelize.col('matches'), targetUser.id) },
          { where: { id: loggedUser.id } },
        );

        await targetUser.update(
          { matches: sequelize.fn('array_append', sequelize.col('matches'), loggedUser.id) },
          { where: { id: targetUser.id } },
        );
      }

      await loggedUser.update(
        { likes: sequelize.fn('array_append', sequelize.col('likes'), targetUserFilter.id) },
        { where: { id: loggedUser.id } },
      );

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(400).json({ error: 'O usuário não existe' });
    }
  }
}

export default new LikeController();
