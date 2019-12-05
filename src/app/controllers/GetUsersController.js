import { Op } from 'sequelize';
import User from '../models/User';
import Profile from '../models/Profile';
import Location from '../models/Location';

import distance from '../functions/jsonEditor';
import distanceFilter from '../functions/distanceFilter';

class GetOnlineController {
  async index(req, res) {
    try {
      const user = await User.findOne({ where: { id: req.userId }, include: ['profiles', 'choices', 'locations'] });

      if (!(user.locations.latitude && user.locations.longitude)) {
        return res.status(400).json({ error: 'localização não informada' });
      }

      let oppositeSex;

      if (user.profiles.sex === 'F') {
        oppositeSex = 'M';
      } else {
        oppositeSex = 'F';
      }

      const [minAge, maxAge] = user.choices.age_range.split('-');

      const users = await User.findAll({
        where: {
          [Op.and]: [{ id: { [Op.notIn]: user.choices.likes } },
            { id: { [Op.notIn]: user.choices.dislikes } }],
        },
        attributes: { exclude: ['createdAt', 'updatedAt', 'password_hash'] },
        include: [{
          model: Profile,
          as: 'profiles',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'UserId', 'user_id'] },
          where: { age: { [Op.between]: [Number(minAge), Number(maxAge)] }, sex: `${oppositeSex}`, user_id: { [Op.ne]: user.id } },
        },
        {
          model: Location,
          as: 'locations',
          attributes: { exclude: ['createdAt', 'updatedAt', 'id', 'UserId', 'user_id'] },
        }],
      });

      distance(users, user.locations.latitude, user.locations.longitude);

      const userFilter = distanceFilter(users, user.choices.max_distance);

      return res.status(200).json({ userFilter });
    } catch (error) {
      return res.status(400).json({ error: 'Erro em buscar os usuários' });
    }
  }
}

export default new GetOnlineController();
