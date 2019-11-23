import Sequelize, { Model } from 'sequelize';
import bcrypt from 'bcryptjs';

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        birth_timestamp: Sequelize.BIGINT,
        sex: Sequelize.STRING,
        bio: Sequelize.STRING,
        filename: Sequelize.STRING,
        email: Sequelize.STRING,
        latitude: Sequelize.DOUBLE,
        longitude: Sequelize.DOUBLE,
        online: Sequelize.BOOLEAN,
        likes: Sequelize.ARRAY(Sequelize.INTEGER),
        dislikes: Sequelize.ARRAY(Sequelize.INTEGER),
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
    });
    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
