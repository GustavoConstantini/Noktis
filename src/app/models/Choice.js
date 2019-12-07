import Sequelize, { Model } from 'sequelize';

class Choice extends Model {
  static init(sequelize) {
    super.init(
      {
        likes: Sequelize.ARRAY(Sequelize.INTEGER),
        dislikes: Sequelize.ARRAY(Sequelize.INTEGER),
        matches: Sequelize.ARRAY(Sequelize.INTEGER),
        age_range: Sequelize.ARRAY(Sequelize.INTEGER),
        max_distance: Sequelize.STRING,
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

export default Choice;
