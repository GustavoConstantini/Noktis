import User from '../models/User';

class GetSessionsController {
  async index(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['connections'] });
      return res.status(200).json(user.connections.sessions);
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao encontrar as sessões' });
    }
  }
}

export default new GetSessionsController();
