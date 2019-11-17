import User from '../models/User';

class LikeController {
  async store(req, res) {

    const { id } = req.params;

    const idNumber = Number(id);

    const { dataValues: loggedUser } = await User.findOne({ where: { id: req.userId }, attributes: ['latitude', 'longitude', 'likes', 'dislikes'] });

    const { dataValues: targetUser } = await User.findOne({ where: { id: idNumber }, attributes: ['latitude', 'longitude', 'likes', 'dislikes'] });
  }
}

export default new LikeController();
