const GameRecordModel = require('../models/game_record');

async function insertGameRecord(userId, score) {
    try {
        console.log('inserting game record');
        
        // Authenticate the database connection asynchronously
        await database.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        // Create a new game record using the GameRecord model
        const gameRecord = await GameRecordModel.GameRecord.create({
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
        database.sequelize.close();
        console.log('Connection closed');
    }
}

async function fetchTop3GameRecords() {
    try {
        console.log('fetching top 3 game records');
        
        // Authenticate the database connection asynchronously
        await database.sequelize.authenticate();
        console.log('Connection has been established successfully.');
        
        // Fetch the top 5 game records sorted by score in descending order
        const top3GameRecords = await GameRecordModel.GameRecord.findAll({
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
        database.sequelize.close();
        console.log('Connection closed');
    }
}

module.exports = {
    fetchTop3GameRecords,
    insertGameRecord
};
