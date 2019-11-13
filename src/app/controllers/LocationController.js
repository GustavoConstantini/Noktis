import User from '../models/User';

class LocationController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { latitude, longitude } =  await user.update(req.body);

    if(!(latitude && longitude)) {
      return res.json({ error: })
    }
  }
}
export default new LocationController();
