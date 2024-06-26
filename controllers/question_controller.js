const QuestionModel = require('../models/question.js');
// Import the Sequelize instance and the Question model
const database = require('../db/appdb.js');

// Function to fetch all questions from the database
async function fetchRandomQuestions(limit = 10) {
        try {
            console.log('fetching random questions');
            
            connection = await database.createConnection();
            // Authenticate the database connection asynchronously
            await connection.authenticate();
            console.log('Connection has been established successfully.');

            Question = QuestionModel.createQuestionModel(connection);
            
            // load questions from the database
            const questions = await Question.findAll({
                order: connection.random(), // Use random() function provided by Sequelize for MySQL
                limit: limit // Default limit to 10 if not specified
            });

                // Log the selected questions
            //console.log('Random questions:', questions);

            return questions;
    
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error; // Optionally, re-throw the error if you want to handle it further up the chain
        } finally {
            // Always close the database connection, whether an error occurred or not
            connection.close();
            console.log('Connection closed');
        }
    }

//test the function
//let questions = fetchRandomQuestions();
//console.log(questions);


module.exports = {
    fetchRandomQuestions 
};