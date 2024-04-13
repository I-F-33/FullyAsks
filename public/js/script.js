// Waits for the HTML to fully load before attempting to load the first question.
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const playerNameInput = document.getElementById('player-name');
    startButton.addEventListener('click', () => {
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            loadQuestions(playerName); // Load questions and start the quiz
        } else {
            alert("Please enter your name!");
        }
    });
});

let currentQuestionIndex = 0; // Tracks the current question
let score = 0; // Tracks the user's score
let questions = []; // Will store the fetched questions

// Function to load questions from the server and start the quiz
function loadQuestions() {
    fetch('/api/questions')
        .then(response => response.json())
        .then(loadedQuestions => {
            console.log('Questions loaded:', loadedQuestions); // What does this log?
            questions = loadedQuestions;
            startQuiz();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
        });
}

function startQuiz(playerName) {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    loadQuestion(); // Load the first question
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    console.log('Current question object:', question);

    const questionElement = document.getElementById('question');
    questionElement.textContent = question.question;

    const answerButtonsElement = document.getElementById('answer-buttons');
    answerButtonsElement.innerHTML = '';

    // Ensure the question has an 'answers' property and it's an array
    if (question.answers) {
        question.answers.forEach(answer => {
            const button = document.createElement('button');
            button.innerText = answer.text;
            button.classList.add('btn');
            button.dataset.correct = answer.correct;
            
            // Make sure the event listener is properly attached
            button.addEventListener('click', selectAnswer);
            
            // Append the button to the answer buttons container
            answerButtonsElement.appendChild(button);
        });
      
    } else {
        console.log('No answers property on the question object.');
        // Handle case where there are no answers
    }

    // Hide the next button until an answer is selected
    document.getElementById('next-btn').classList.add('hidden');
}

function selectAnswer(e) {
    console.log('Answer clicked:', e.target); // Log which button was clicked
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    console.log('Is the selected answer correct?', correct); // Check if the answer is correct

    if (correct) {
        score++;
        console.log('Score updated:', score); // Log the updated score
    }

    // Assuming 'results' array is declared globally to store the user's answers
    results.push({
        question: questions[currentQuestionIndex].question,
        yourAnswer: selectedButton.innerText,
        correct
    });

    document.querySelectorAll('.btn').forEach(button => {
        button.disabled = true;
        if (button.dataset.correct === 'true') {
            button.classList.add('correct');
        } else {
            button.classList.add('incorrect');
        }
    });

    // Show the next button
    document.getElementById('next-btn').classList.remove('hidden');
}

// Check if the next button exists and add the event listener
const nextButton = document.getElementById('next-btn');
if (nextButton) {
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++; // Move to the next question
        if (currentQuestionIndex < questions.length) {
            loadQuestion(); // Load the next question
        } else {
            showSummary(); // Show the summary if there are no more questions
        }
    });
} else {
    console.error('Next button not found'); // Log an error if the next button doesn't exist
}


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
