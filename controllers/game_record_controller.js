const GameRecordModel = require('../models/game_record');
const UserModel = require('../models/user');
const database = require('../db/appdb');

async function insertGameRecord(userId, score) {
    console.log('inserting game record');
    try {
        console.log('inserting game record');
        
        // Authenticate the database connection asynchronously
        connection = database.createConnection();
        await connection.authenticate();
        console.log('Connection has been established successfully.');

        user_model = await UserModel.createUserModel(connection);
        gameRecord_model = await GameRecordModel.createGameRecordModel(connection, user_model);
        
        // Create a new game record using the GameRecord model
        const gameRecord = await gameRecord_model.create({
            user_id: userId,
            score: score,
        });

        // Return the created game record
        return gameRecord;

    } catch (error) {
        console.error('Error inserting game record:', error);
        throw error; // Optionally, re-throw the error if you want to handle it further up the chain
    } finally {
        // Always close the database connection, whether an error occurred or not
        connection.close();
        console.log('Connection closed');
    }
}

async function fetchTop3GameRecords() {
    try {
        console.log('fetching top 3 game records');
        
        // Authenticate the database connection asynchronously

        connection = await database.createConnection();
        await connection.authenticate();
        console.log('Connection has been established successfully.');

        gameRecord_model = await GameRecordModel.createGameRecordModel(connection, UserModel.createUserModel(connection));
        
        // Fetch the top 5 game records sorted by score in descending order
        const top3GameRecords = await gameRecord_model.findAll({
            order: [['score', 'DESC']], // Order by score in descending order
            limit: 3, // Limit to 5 records
        });

        // Return the fetched game records
        return top3GameRecords;

    } catch (error) {
        console.error('Error fetching game record:', error);
        throw error; // Optionally, re-throw the error if you want to handle it further up the chain
    } finally {
        // Always close the database connection, whether an error occurred or not
        connection.close();
        console.log('Connection closed');
    }
}

module.exports = {
    fetchTop3GameRecords,
    insertGameRecord
};
