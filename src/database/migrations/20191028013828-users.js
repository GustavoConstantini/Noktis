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
      allowNull: false,
      unique: false,
    },
    email: {
      type: Sequelize.STRING,
      allowwNull: false,
      unique: true,
    },
    latitude: {
      type: Sequelize.DOUBLE,
      defaultValue: null,
    },
    longitude: {
      type: Sequelize.DOUBLE,
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
    dislikes: {
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
