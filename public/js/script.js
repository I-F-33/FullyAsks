// Waits for the HTML to fully load before attempting to load the first question.
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const playerNameInput = document.getElementById('player-name');
    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if(playerName) {
            startQuiz(playerName);
        } else {
            alert("Please enter your name!");
        }
    });
});

let currentQuestionIndex = 0; // Tracks the current question
let score = 0; // Tracks the user's score
let results = []; // Stores results for each question

const questions = [
    {
        question: "What is 2 + 2?",
        answers: [
            { text: "4", correct: true },
            { text: "3", correct: false },
            { text: "22", correct: false },
            { text: "5", correct: false }
        ]
    },
    // Add more questions as needed
];

function startQuiz(playerName) {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    loadQuestion();
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    const questionElement = document.getElementById('question');
    questionElement.textContent = question.question;
    const answerButtonsElement = document.getElementById('answer-buttons');
    answerButtonsElement.innerHTML = ''; // Clear previous answers

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.dataset.correct = answer.correct; // Mark the button as correct or incorrect
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });

    // Hide the next button until an answer is selected
    document.getElementById('next-btn').classList.add('hidden');
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';

    if(correct) {
        score++;
    }

    results.push({
        question: questions[currentQuestionIndex].question,
        yourAnswer: selectedButton.innerText,
        correct
    });

    document.querySelectorAll('.btn').forEach(button => {
        button.disabled = true; // Disable all answer buttons
        if (button.dataset.correct === 'true') {
            button.classList.add('correct'); // Highlight correct answers in green
        } else {
            button.classList.add('incorrect'); // Highlight incorrect answers in red
        }
    });

    // Show the next button
    document.getElementById('next-btn').classList.remove('hidden');
}

document.getElementById('next-btn').addEventListener('click', () => {
    currentQuestionIndex++; // Move to the next question
    if (currentQuestionIndex < questions.length) {
        loadQuestion(); // Load the next question
    } else {
        showSummary(); // Show the summary if there are no more questions
    }
});

function showSummary() {
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('summary-screen').classList.remove('hidden');
    const summaryScreen = document.getElementById('summary-screen');
    summaryScreen.innerHTML = `<h2>Quiz Summary</h2><p>Your final score is ${score} out of ${questions.length}</p>`;

    results.forEach((result, index) => {
        const resultElement = document.createElement('div');
        resultElement.innerHTML = `
            <p>Question ${index + 1}: ${result.question}</p>
            <p>Your answer: ${result.yourAnswer} - ${result.correct ? 'Correct' : 'Incorrect'}</p>
        `;
        summaryScreen.appendChild(resultElement);
    });

    // Reset for a new game or provide options for feedback/leaderboard here
}
