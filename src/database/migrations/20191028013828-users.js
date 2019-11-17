module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('users', {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
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
      defaultValue: null,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
      allowwNull: false,
      unique: true,
    },
    latitude: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    longitude: {
      type: Sequelize.STRING,
      defaultValue: null,
    },
    online: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    likes: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    deslikes: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
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
