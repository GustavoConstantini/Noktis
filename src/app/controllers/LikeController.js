import sequelize from 'sequelize';
import User from '../models/User';

class LikeController {
  async store(req, res) {
    try {
      if (req.user != req.userId) {
        return res.status(400).json({ error: 'falha ao passar os parametros para o socket' });
      }
      const { id } = req.body;

      const loggedUser = await User.findByPk(req.userId);

      loggedUser.socket = req.socketIo;

      await loggedUser.save();

      const { dataValues: targetUser } = await User.findOne({ where: { id }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt'] } });

      if (targetUser.likes !== null) {
        if (targetUser.likes.includes(loggedUser.id)) {
          await loggedUser.update(
            { matches: sequelize.fn('array_append', sequelize.col('matches'), targetUser.id) },
            { where: { id: loggedUser.id } },
          );

          await targetUser.update(
            { matches: sequelize.fn('array_append', sequelize.col('matches'), targetUser.id) },
            { where: { id: targetUser.id } },
          );

          if (loggedUser.socket) {
            req.io.to(loggedUser.socket).emit('match', targetUser);
          }

          if (targetUser.socket) {
            req.io.to(targetUser.socket).emit('match', loggedUser);
          }
        }
      }

      await loggedUser.update(
        { likes: sequelize.fn('array_append', sequelize.col('likes'), targetUser.id) },
        { where: { id: req.userId } },
      );
    } catch (error) {
      return res.status(400).json({ error: 'O usuário não existe' });
    }

    return res.status(200).json({ ok: true });
  }
}

export default new LikeController();
