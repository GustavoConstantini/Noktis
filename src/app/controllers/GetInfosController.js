import User from '../models/User';

class GetInfosController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['profiles'], attributes: { exclude: ['password_hash', 'createdAt', 'updatedAt'] } });

      const userFilter = {
        email: user.email,
        filename: user.profiles.filename,
      };
      return res.status(200).json({ userFilter });
    } catch (error) {
      return res.status(400).json({ error: 'O usuário não existe' });
    }
  }
}

export default new GetInfosController();
