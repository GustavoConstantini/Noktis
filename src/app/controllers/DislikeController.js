import sequelize from 'sequelize';
import User from '../models/User';

class DislikeController {
  async store(req, res) {
    try {
      const { id } = req.body;

      const loggedUser = await User.findByPk(req.userId);

      await loggedUser.update(
        { dislikes: sequelize.fn('array_append', sequelize.col('dislikes'), id) },
        { where: { id: req.userId } },
      );
    } catch (error) {
      return res.status(400).json({ error: 'O usuário não existe' });
    }

    return res.status(200).json({ ok: true });
  }
}

export default new DislikeController();
