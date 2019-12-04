import Sequelize, { Model } from 'sequelize';

import ageConverter from '../functions/ageConverter';

class Profile extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        age: Sequelize.INTEGER,
        sex: Sequelize.STRING,
        bio: Sequelize.STRING,
        filename: Sequelize.STRING,
        birth_timestamp: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      },
    );
    this.addHook('beforeSave', async (user) => {
      if (user.birth_timestamp) {
        user.age = ageConverter(user.birth_timestamp);
      }
    });
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User);
  }
}

export default Profile;
