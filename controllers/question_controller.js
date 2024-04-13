const Question = require('../models/question.js');
// Import the Sequelize instance and the Question model
const sequelize = require('../db/appdb.js');

// Function to fetch all questions from the database
async function fetchAllQuestions() {
    try {
        // Fetch all questions from the Question model
        const questions = await Question.findAll();
        
        // Log or handle the questions array
        console.log('All questions:', questions);

        // Return the questions array
        return questions;
    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error fetching questions:', error);
    }

    sequelize.close();
}

// Call the function to fetch all questions
fetchAllQuestions();
