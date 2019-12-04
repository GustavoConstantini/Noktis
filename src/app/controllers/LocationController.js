import Location from '../models/Location';

class LocationController {
  async store(req, res) {
    try {
      const location = await Location.findOne({ where: { user_id: req.userId } });

      const { latitude, longitude } = req.body;

      if (!(latitude && longitude)) {
        if (!req.body.online) {
          return res.status(400).json({ error: 'Erro ao passar o parametro' });
        }
      }

      if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
        await location.update({ latitude, longitude });

        return res.status(200).json({ ok: 'true' });
      }

      return res.status(400).json({ error: 'Erro ao validar a localização' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao validar a localização' });
    }
  }
}
export default new LocationController();
