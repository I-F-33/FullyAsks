// Waits for the HTML to fully load before attempting to load the first question.
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const playerNameInput = document.getElementById('player-name');
    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            startQuiz(playerName);
        } else {
            alert("Please enter your name!");
        }
    });
});

let currentQuestionIndex = 0; // Keep track of the current question
let questions = [
    // Placeholder for questions. Ideally, this should be loaded from your backend or database
    {
        question: "What is 2 + 2?",
        answers: [
            { text: "4", correct: true },
            { text: "3", correct: false },
            { text: "5", correct: false },
            { text: "22", correct: false }
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
        button.dataset.correct = answer.correct; // Use dataset to mark the correct answer
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });

    // Hide the next button until an answer is selected
    document.getElementById('next-btn').classList.add('hidden');
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true'; // Check if the selected answer is correct

    // Highlight answers and disable buttons
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
    // Implement summary display logic here
    console.log("Quiz Completed");
}
