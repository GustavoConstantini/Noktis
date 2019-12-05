import Sequelize, { Model } from 'sequelize';

class Connection extends Model {
  static init(sequelize) {
    super.init(
      {
        socket: Sequelize.STRING,
        await_message: Sequelize.ARRAY(Sequelize.JSON),
        expire_token: Sequelize.ARRAY(Sequelize.STRING),
        sessions: Sequelize.ARRAY(Sequelize.JSON),
      },
      {
        sequelize,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User);
  }
}

export default Connection;
