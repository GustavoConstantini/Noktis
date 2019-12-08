import User from '../models/User';

import getAddress from '../functions/address';

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

        const {
          village, town, city, suburb
        } = await getAddress(latitude, longitude);

        let address;

        if (suburb) {
          address = `${suburb}, ${village || town || city || ''}`;
        } else {
          address = `${village || town || city || ''}`;
        }

        await user.locations.update({ latitude, longitude, address });
     
        return res.status(200).json({ ok: 'true' });
      }

      return res.status(400).json({ error: 'Erro ao validar a localização' });
    } catch (error) {
      return res.status(400).json({ error: 'Erro ao validar a localização' });
    }
  }
}
export default new LocationController();
