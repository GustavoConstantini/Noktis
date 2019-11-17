import sequelize from 'sequelize';
import User from '../models/User';

class LikeController {
  async store(req, res) {
    const { id } = req.body;

    const idNumber = Number(id);

    const loggedUser = await User.findByPk(req.userId);

    const { dataValues: targetUser } = await User.findOne({ where: { id: idNumber }, attributes: { exclude: ['password_hash', 'email', 'createdAt', 'updatedAt'] } });

    if (targetUser.likes !== null) {
      if (targetUser.likes.includes(loggedUser.id)) {
        console.log('Deu MATCH');
      }
    }

    await loggedUser.update(
      { likes: sequelize.fn('array_append', sequelize.col('likes'), idNumber) },
      { where: { id: req.userId } },
    );


    return res.json(loggedUser);
  }
}

export default new LikeController();
