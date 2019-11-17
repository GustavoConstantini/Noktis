import Distancia from '../../config/distancia';
import User from '../models/User';

class GetDistanciaController {
  async store(req, res) {
    const { id } = req.params;

    const idNumber = Number(id);

    const { dataValues: user } = await User.findOne({ where: { id: req.userId }, attributes: ['latitude', 'longitude'] });

    const { dataValues: getUser } = await User.findOne({ where: { id: idNumber }, attributes: ['latitude', 'longitude'] });


    const { latitude: lat1, longitude: lon1 } = user;
    const { latitude: lat2, longitude: lon2 } = getUser;


    const distancia = Distancia(Number(lat1), Number(lon1),
      Number(lat2), Number(lon2));

    return res.json({ distancia });
  }
}

export default new GetDistanciaController();
