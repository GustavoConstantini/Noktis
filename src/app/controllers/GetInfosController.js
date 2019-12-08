import User from '../models/User';

class GetInfosController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['profiles', 'choices'], attributes: { exclude: ['password_hash', 'createdAt', 'updatedAt'] } });

      const profile = {
        email: user.email,
        bio: user.profiles.bio,
        filename: user.profiles.filename,
        age_range: user.choices.age_range,
        max_distance: user.choices.max_distance,
      };
      return res.status(200).json({ profile });
    } catch (error) {
      return res.status(400).json({ error: 'O usuário não existe' });
    }
  }
}

export default new GetInfosController();
