 const Question = require('../models/question.js');
// Import the Sequelize instance and the Question model
const sequelize = require('../db/appdb.js');

// Function to fetch all questions from the database
async function fetchRandomQuestions(limit = 10) {
    try {
        // Fetch a random set of questions from the Question model, limited to 'limit' number of questions
        const questions = await Question.findAll({
            order: sequelize.random(), // Use random() function provided by Sequelize for MySQL
            limit: limit // Default limit to 10 if not specified
        });

        // Log the selected questions
        console.log('Random questions:', questions);

        // Return the random questions
        return questions;
    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error fetching random questions:', error);
        throw error; // It's important to throw the error so it can be caught by the calling function
    }
}

module.exports = {
    fetchRandomQuestions 
};