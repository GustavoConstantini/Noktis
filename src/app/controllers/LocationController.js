import User from '../models/User';

class LocationController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    await user.update(req.body);

    return res.status(200).json({ ok: 'true' });
  }
}
export default new LocationController();
