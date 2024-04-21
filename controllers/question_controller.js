const QuestionModel = require('../models/question.js');
// Import the Sequelize instance and the Question model
const database = require('../db/appdb.js');

// Function to fetch all questions from the database
async function fetchRandomQuestions(limit = 10) {
    try {
        database.sequelize
        .authenticate()
        .then(async () => {
            console.log('Connection has been established successfully.');
            
            // Fetch random questions from the database
            // Fetch a random set of questions from the Question model, limited to 'limit' number of questions
            const questions = await QuestionModel.Question.findAll({
                order: database.sequelize.random(), // Use random() function provided by Sequelize for MySQL
                limit: limit // Default limit to 10 if not specified
            });

        // Log the selected questions
        console.log('Random questions:', questions);


        console.log('Connection closed');
        database.sequelize.close();

        // Return the random questions
        return questions;
            
        })
        .catch((error) => {
            console.error('Unable to connect to the database:', error);
        });
        
    } catch (error) {
        // Handle any errors that occur during the query
        console.error('Error fetching random questions:', error);
        throw error; // It's important to throw the error so it can be caught by the calling function
    }
}

//test the function
//let questions = fetchRandomQuestions();
//console.log(questions);


module.exports = {
    fetchRandomQuestions 
};