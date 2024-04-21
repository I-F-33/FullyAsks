const GameRecordModel = require('../models/game_record');

async function insertGameRecord(userId, score) {
    try {
        // Create a new game record using the GameRecord model
        const gameRecord = await GameRecordModel.GameRecord.create({
            user_id: userId,
            score: score,
        });

        // Return the created game record
        return gameRecord;
    } catch (error) {
        console.error('Error inserting game record:', error);
    }
}

async function fetchTop3GameRecords() {
    try {
        // Fetch the top 5 game records sorted by score in descending order
        const top3GameRecords = await GameRecordModel.GameRecord.findAll({
            order: [['score', 'DESC']], // Order by score in descending order
            limit: 3, // Limit to 5 records
        });

        // Return the fetched game records
        return top3GameRecords;
    } catch (error) {
        console.error('Error fetching top 5 game records:', error);
    }
}

module.exports = {
    fetchTop3GameRecords,
    insertGameRecord
};
