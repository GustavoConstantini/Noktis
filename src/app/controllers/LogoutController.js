import sequelize from 'sequelize';
import User from '../models/User';

class LogoutController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['connections'] });

      const [, token] = req.headers.authorization.split(' ');

      await user.connections.update(
        { expire_token: sequelize.fn('array_append', sequelize.col('expire_token'), token) },
        { where: { user_id: user.id } },
      );

      user.connections.sessions.map((currentElement, index) => {
        if (currentElement.authorization === token) {
          user.connections.sessions.splice(index, 1);
        }
        return this;
      });

      await user.connections.update({ sessions: user.connections.sessions });

      return res.status(200).json({ ok: true });
    } catch (error) {
      return res.status(400).json({ error: 'Erro em realizar o logout' });
    }
  }
}

export default new LogoutController();
