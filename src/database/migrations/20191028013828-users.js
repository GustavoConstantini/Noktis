module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowwNull: false,
      unique: true,
    },
    socket: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    await_message: {
      type: Sequelize.ARRAY(Sequelize.JSON),
      defaultValue: [],
    },
    password_hash: {
      type: Sequelize.STRING,
      allowNull: false,
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

  down: (queryInterface) => queryInterface.dropTable('users'),
};
