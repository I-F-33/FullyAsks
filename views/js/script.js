
let currentQuestionIndex = 0; // Tracks the current question
let score = 0; // Tracks the user's score
let questions = []; // Will store the fetched questions
let user = {}; // Will store the user object
let timer;
let timeLeft = 30; // seconds for each question
let results = []; // Will store the results of each question


// Waits for the HTML to fully load before attempting to load the first question.
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    const playerNameInput = document.getElementById('player-name');
    const playerClassYear = document.getElementById('player-year');

    console.log('Content loaded!'); // Log that the content has loaded

    startButton.addEventListener('click', () => {
        console.log('Start button clicked!'); // Log that the start button was clicked
        const playerName = playerNameInput.value.trim();
        const playerYear = playerClassYear.value.trim();

        if (playerName != '' && playerYear != '') {
            console.log('Player name:', playerName); // Log the player's name
            console.log('Player year:', playerYear); // Log the player's class year
    
            const player = { playerName, playerYear };
            console.log('Player object:', player); // Log the player object

            fetch('/createUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(player),
            })
                .then(response => {
                    console.log('Response:', response);
                    return response.json();
                })
                .then(data => {
                    console.log('Success:', data);

                    //log the user
                    console.log('User:', data);
                    //Do what you want here with the user data!!!!
                    user = data;

                })
                .catch((error) => {
                    console.error('Error:', error);
                });

                loadQuestions(playerName); // Load questions and start the quiz
        } else {
            alert("Please enter your name or your class year!");
        }
    });
});

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `Time Remaining: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            showTimeUp(); // Move to the next question when time is up
        }
    }, 1000);
}


function resetTimer() {
    stopTimer(); // Stop the current timer
    timeLeft = 30; // Reset the time for the next question

    const timerElement = document.getElementById('timer');
    timerElement.textContent = `Time Remaining: ${timeLeft}s`;
}

function stopTimer() {
    clearInterval(timer);
}

function showTimeUp() {
    // Directly move to the next question without alerting the user
    moveToNextQuestion();
}


function updateScore(isCorrect) {
    const scoreElement = document.getElementById('score');
    if (isCorrect) {
        score++;
        scoreElement.classList.add('score-increase');
        setTimeout(() => scoreElement.classList.remove('score-increase'), 500);
    }
    scoreElement.textContent = `Score: ${score}`;
}


// Function to load questions from the server and start the quiz
function loadQuestions() {
    fetch('/questions')
        .then(response => response.json())
        .then(loadedQuestions => {
            console.log('Questions loaded:', loadedQuestions);
            questions = loadedQuestions;            
            startQuiz();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
        });
        resetTimer(); // Reset and start the timer for the new question
        startTimer(); // Start the countdown for the current question
}

function startQuiz(playerName) {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');
    loadQuestion(); // Load the first question
    startTimer();   // Start the timer
}

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    console.log('Current question object:', question);

    const questionElement = document.getElementById('question');
    questionElement.textContent = question.question;

    const answerButtonsElement = document.getElementById('answer-buttons');
    answerButtonsElement.innerHTML = '';

    // Dynamically create buttons for each choice.
    // This assumes you have 4 choices per question.
    for (let i = 1; i <= 4; i++) {
        const choiceKey = `choice_${i}`;
        if (question[choiceKey]) {
            const button = document.createElement('button');
            button.innerText = question[choiceKey];
            button.classList.add('btn');
            button.dataset.correct = question.correct_answer === i.toString();
            
            button.addEventListener('click', selectAnswer);
            answerButtonsElement.appendChild(button);
        }
    }

    // Hide the next button until an answer is selected
    document.getElementById('next-btn').classList.add('hidden');
}


function selectAnswer(e) {
    const selectedButton = e.target;
    const correctAnswer = questions[currentQuestionIndex].correct_answer;
    const isCorrect = selectedButton.innerText === correctAnswer;

    // Update the score if the answer is correct
    updateScore(isCorrect);

    // Add the question and the user's answer to the results array
    results.push({
        question: questions[currentQuestionIndex].question,
        answer: selectedButton.innerText,
        isCorrect: isCorrect // This is a boolean indicating if the answer was correct
    });

    // Stop the timer when an answer is selected
    stopTimer();

    // Provide immediate visual feedback on the answer
    selectedButton.classList.add(isCorrect ? 'correct' : 'incorrect');
    
    // Wait 2 seconds to provide feedback, then move to the next question
    setTimeout(() => {
        selectedButton.classList.remove(isCorrect ? 'correct' : 'incorrect');

        if (currentQuestionIndex < questions.length - 1) {
            // Move to the next question if there are any left
            moveToNextQuestion();
        } else {
            // If it was the last question, show the summary
            showSummary();
        }
    }, 2000);
}


function moveToNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < questions.length) {
        loadQuestion(); // Load the next question
        resetTimer();   // Reset the timer for the new question
        startTimer();   // Start the new timer
    } else {
        showSummary();  // Show the summary if there are no more questions
    }
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
    document.getElementById('question-screen').classList.add('hidden'); // Hide the question screen
    const summaryScreen = document.getElementById('summary-screen');
    summaryScreen.classList.remove('hidden'); // Show the summary screen

    summaryScreen.innerHTML = '<h2>Quiz Summary</h2>'; // Reset the innerHTML
    results.forEach((result, index) => {
        const resultElement = document.createElement('p');
        resultElement.textContent = `Question ${index + 1}: ${result.question} - Your Answer: ${result.answer} (${result.isCorrect ? 'Correct' : 'Incorrect'})`;
        summaryScreen.appendChild(resultElement);
    });


    document.getElementById('final-score').textContent = `Final Score: ${score}`;
}



