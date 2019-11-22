import sequelize from 'sequelize';
import User from '../models/User';

class LikeController {
  async store(req, res) {
    try {
      const { id } = req.body;
  
      const loggedUser = await User.findByPk(req.userId);

      const { dataValues: targetUser } = await User.findOne({ where: { id }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt'] } });

      if (targetUser.likes !== null) {
        if (targetUser.likes.includes(loggedUser.id)) {
          const loggedSocket = req.connectedUsers[req.userId];
          const targetSocket = req.connectedUsers[id];

          if (loggedSocket) {
            req.io.to(loggedSocket).emit('match', targetUser);
          }

          if (targetSocket) {
            req.io.to(targetSocket).emit('match', loggedUser);
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
