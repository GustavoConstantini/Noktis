import User from '../models/User';

class LocationController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { latitude, longitude } =  await user.update(req.body);

    if(!(latitude && longitude)) {
      return res.status(400).json({ error: 'Falha ao validar' });
    }

    return res.status(200).json({ ok: 'true' });
  }
}
export default new LocationController();

