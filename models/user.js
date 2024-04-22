const { DataTypes } = require('sequelize');
const database = require('../db/appdb'); // make sure this path is correct

const User = database.sequelize.define('User', {
  // The model attributes are defined here
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // Add other user attributes as needed
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  // Other model options go here
  tableName: 'users', // Specify the table name if different from model name
  timestamps: false // If you want Sequelize to automatically add `createdAt` and `updatedAt`
});

// If you have other associations, you can define them here, for example:
// User.hasMany(OtherModel, { foreignKey: 'user_id' });

module.exports = {User};
