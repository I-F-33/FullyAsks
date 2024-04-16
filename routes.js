
const express = require('express');
const router = express.Router();

const questionController = require('./controllers/question_controller');
const gameRecordController = require('./controllers/game_record_controller');
const userController = require('./controllers/user_controller');

// Questions routes
router.get('/questions', async (req, res) => {
    try {
        const questions = await questionController.fetchAllQuestions();
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Game records routes
router.post('/game-records', async (req, res) => {
    try {
        const { userId, score } = req.body;
        const gameRecord = await gameRecordController.insertGameRecord(userId, score);
        res.status(201).json(gameRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/game-records/top', async (req, res) => {
    try {
        const topRecords = await gameRecordController.fetchTop5GameRecords();
        res.json(topRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Users routes
router.post('/users', async (req, res) => {
    try {
        const newUser = await userController.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users/:username', async (req, res) => {
    try {
        const user = await userController.getUserByUsername(req.params.username);
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
