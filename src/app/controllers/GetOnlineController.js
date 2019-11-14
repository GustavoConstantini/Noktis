import Users from '../models/User';

class GetOnlineController {
  async store(req, res) {
    const User = await Users.findAll({ where: { online: true }, attributes: ['name', 'bio', 'sex', 'filename', 'latitude', 'longitude'] });
    const users = User.map((index) => index.dataValues);
    if (!users) {
      return res.status(400).json({ error: 'Bad request' });
    }
    return res.json({ users });
  }
}

export default new GetOnlineController();
