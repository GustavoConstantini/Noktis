import User from '../models/User';

class LocationController {
  async store(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['locations'] });

      const { latitude, longitude } = req.body;

      if (!(latitude && longitude)) {
        return res.status(400).json({ error: 'Erro ao passar o parametro' });
      }

      if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        await user.locations.update({ latitude, longitude });

        return res.status(200).json({ ok: 'true' });
      }

      return res.status(400).json({ error: 'Erro ao validar a localização' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao validar a localização' });
    }
  }
}
export default new LocationController();
