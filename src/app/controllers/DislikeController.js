import sequelize from 'sequelize';
import User from '../models/User';

class DislikeController {
  async store(req, res) {
    const { id } = req.body;

    const loggedUser = await User.findByPk(req.userId);

    try {
      const { dataValues: targetUser } = await User.findOne({ where: { id }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt'] } });

      await loggedUser.update(
        { dislikes: sequelize.fn('array_append', sequelize.col('dislikes'), targetUser.id) },
        { where: { id: req.userId } },
      );
    } catch (error) {
      return res.status(404).json({ error: 'O usuário não existe' });
    }

    return res.status(200).json({ ok: true });
  }
}

export default new DislikeController();
