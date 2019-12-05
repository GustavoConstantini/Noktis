import sequelize from 'sequelize';
import User from '../models/User';

class LogoutController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['connections'] });

      const [, token] = req.headers.authorization;

      await user.connections.update(
        { expire_token: sequelize.fn('array_append', sequelize.col('expire_token'), token) },
        { where: { user_id: user.id } },
      );
      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(400).json({ error: 'Erro em realizar o logout' });
    }
  }
}

export default new LogoutController();
