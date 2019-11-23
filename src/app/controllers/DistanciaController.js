import Distancia from '../functions/distancia';
import User from '../models/User';

class GetDistanciaController {
  async store(req, res) {
    const { id } = req.body;

    const { dataValues: loggedUser } = await User.findOne({ where: { id: req.userId }, attributes: ['latitude', 'longitude'] });

    const { dataValues: targetUser } = await User.findOne({ where: { id }, attributes: ['latitude', 'longitude'] });


    const { latitude: lat1, longitude: lon1 } = loggedUser;
    const { latitude: lat2, longitude: lon2 } = targetUser;


    const distancia = Distancia(lat1, lon1,
      lat2, lon2);

    return res.status(200).json({ distancia });
  }
}

export default new GetDistanciaController();
