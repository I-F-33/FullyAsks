// models/Question.js

const { DataTypes } = require('sequelize');

function createQuestionModel(connection){
// Define the Question model
    const Question = connection.define('Question', {
        // Define the model attributes
        question_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        question: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        question_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        choice_1: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        choice_2: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        choice_3: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        choice_4: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        correct_answer: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    }, {
        // Options (if needed)
        tableName: 'questions', // Specify the existing table name
        timestamps: false, // Set to false if your table does not have `createdAt` and `updatedAt` columns
    });

    return Question;
}
// Export the Question model
module.exports = {createQuestionModel};
