import User from '../models/User';

class LocationController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { latitude, longitude } = req.body;

    if (!(latitude && longitude)) {
      if (!req.body.online) {
        return res.status(400).json({ error: 'Erro ao passar o parametro' });
      }
    }

    if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
      await user.update(req.body);

      return res.status(200).json({ ok: 'true' });
    }

    return res.status(400).json({ error: 'Erro ao validar a localização' });
  }
}
export default new LocationController();
