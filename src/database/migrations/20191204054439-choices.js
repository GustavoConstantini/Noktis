module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('choices', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    likes: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
    },
    dislikes: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
    },
    matches: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [],
    },
    age_range: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
      defaultValue: [18, 100],
    },
    max_distance: {
      type: Sequelize.INTEGER,
      defaultValue: 50,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('choices'),
};
