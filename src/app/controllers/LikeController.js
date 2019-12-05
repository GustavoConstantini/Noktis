import sequelize from 'sequelize';
import User from '../models/User';

class LikeController {
  async store(req, res) {
    try {
      const { id } = req.body;

      const loggedUser = await User.findOne({ where: { id: req.userId }, include: ['profiles', 'choices', 'connections'] });

      const targetUser = await User.findOne({ where: { id }, include: ['profiles', 'choices', 'connections'] });

      if (targetUser.choices.likes.includes(loggedUser.id)) {
        if (loggedUser.connections.socket) {
          req.io.to(loggedUser.connections.socket).emit('match', targetUser.profiles);
        }

        if (targetUser.connections.socket) {
          req.io.to(targetUser.connections.socket).emit('match', loggedUser.profiles);
        }

        await loggedUser.choices.update(
          { matches: sequelize.fn('array_append', sequelize.col('matches'), targetUser.id) },
          { where: { user_id: loggedUser.id } },
        );

        await targetUser.choices.update(
          { matches: sequelize.fn('array_append', sequelize.col('matches'), loggedUser.id) },
          { where: { user_id: targetUser.id } },
        );
      }

      await loggedUser.choices.update(
        { likes: sequelize.fn('array_append', sequelize.col('likes'), targetUser.id) },
        { where: { user_id: loggedUser.id } },
      );

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(400).json({ error: 'O usuário não existe' });
    }
  }
}

export default new LikeController();
