import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';
import ageConverter from '../functions/ageConverter';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        age: Sequelize.INTEGER,
        birth_timestamp: Sequelize.VIRTUAL,
        sex: Sequelize.STRING,
        bio: Sequelize.STRING,
        filename: Sequelize.STRING,
        email: Sequelize.STRING,
        latitude: Sequelize.DOUBLE,
        longitude: Sequelize.DOUBLE,
        online: Sequelize.BOOLEAN,
        age_range: Sequelize.STRING,
        likes: Sequelize.ARRAY(Sequelize.INTEGER),
        dislikes: Sequelize.ARRAY(Sequelize.INTEGER),
        matches: Sequelize.ARRAY(Sequelize.INTEGER),
        await_message: Sequelize.ARRAY(Sequelize.JSON),
        socket: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        password: Sequelize.VIRTUAL,
      },
      {
        sequelize,
      },
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
      if (user.birth_timestamp) {
        user.age = ageConverter(user.birth_timestamp);
      }
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
