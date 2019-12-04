module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('profiles', {
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
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    age: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    sex: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    bio: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
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

  down: (queryInterface) => queryInterface.dropTable('profiles'),
};
