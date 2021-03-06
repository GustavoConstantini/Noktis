import Sequelize, { Model } from 'sequelize';

class Location extends Model {
  static init(sequelize) {
    super.init(
      {
        latitude: Sequelize.DOUBLE,
        longitude: Sequelize.DOUBLE,
        address: Sequelize.STRING,
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

export default Location;
