// models/GameRecord.js

const { DataTypes } = require('sequelize');
const database = require('../db/appdb');
const User = require('../models/user'); // Import the User model

function createGameRecordModel(connection, user){
// Define the GameRecord model
    const GameRecord = connection.define('GameRecord', {
        // Define the model attributes
        game_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User, // Reference the User model
                key: 'user_id', // Specify the foreign key in the User model
            },
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        // Options (if needed)
        tableName: 'game_record', // Specify the existing table name
        timestamps: false, // Set to false if your table does not have `createdAt` and `updatedAt` columns
    });

    // Define the association between GameRecord and User
    GameRecord.belongsTo(user, {
        foreignKey: 'user_id', // Specify the foreign key
    });

    return GameRecord;
}

// Export the GameRecord model
module.exports = {createGameRecordModel};
