// Waits for the HTML to fully load before attempting to load the first question.
document.addEventListener('DOMContentLoaded', () => {
    loadQuestion();
});

let currentQuestionIndex = 0;
let score = 0; // Keep track of the score

// Makes a fetch request to your backend service to retrieve questions. You'll need to replace /api/questions with the actual URL of your backend endpoint.
function loadQuestion() {
    fetch('/api/questions')
        .then(response => response.json())
        .then(data => {
            showQuestion(data.questions[currentQuestionIndex]);
        })
        .catch(error => {
            console.error('Error fetching questions:', error);
        });
}

//Takes the current question object and updates the DOM to display the question and its answers as buttons
function showQuestion(question) {
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');

    // Reset the state
    questionElement.innerText = '';
    answerButtonsElement.innerHTML = '';

    // Set the question text
    questionElement.innerText = question.question;

    // Create buttons for each answer
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.addEventListener('click', () => selectAnswer(answer.correct));
        answerButtonsElement.appendChild(button);
    });
}

// Handles click events on answer buttons, checks if the selected answer is correct, updates the score, and loads the next question.
function selectAnswer(correct) {
    if (correct) {
        console.log('Correct answer selected');
        score++; // Increment the score
    } else {
        console.log('Wrong answer selected');
    }
    currentQuestionIndex++;
    loadQuestion(); // Load the next question
}

// Add more functions as needed, such as for ending the quiz, showing the score, etc.
