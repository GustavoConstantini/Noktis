import User from '../models/User';

class GetInfosController {
  async store(req, res) {
    try {
      const { dataValues: user } = await User.findOne({ where: { id: req.userId }, attributes: { exclude: ['password_hash', 'createdAt', 'updatedAt', 'id', 'name', 'matches', 'likes', 'sex', 'birth_timestamp', 'dislikes', 'socket', 'online', 'latitude', 'longitude'] } });

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(400).josn({ error: 'O usuário não existe' });
    }
  }
}

export default new GetInfosController();
