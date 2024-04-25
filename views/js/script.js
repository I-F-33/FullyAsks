
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

    startButton.addEventListener('click', async () => {
        console.log('Start button clicked!'); // Log that the start button was clicked
        const playerName = playerNameInput.value.trim();
        const playerYear = playerClassYear.value.trim();
    
        if (playerName !== '' && playerYear !== '') {
            console.log('Player name:', playerName); // Log the player's name
            console.log('Player year:', playerYear); // Log the player's class year
    
            const player = { playerName, playerYear };
            console.log('Player object:', player); // Log the player object
    
            try {
                const response = await fetch('/createUser', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(player),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('Success:', data);
                    user = data; // Store user data
    
                    // Load questions and start the quiz
                    loadQuestions();
                } else {
                    console.error('Error:', response.statusText);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            alert("Please enter your name or your class year!");
        }
    });
});
    

function startTimer() {
    stopTimer();
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
    // Move to the next question or end the quiz if there are no more questions
    if (currentQuestionIndex < questions.length - 1) {
        moveToNextQuestion();
    } else {
        showSummary();
    }
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
async function loadQuestions() {
    try {
        const response = await fetch('/questions');
        const loadedQuestions = await response.json();
        console.log('Questions loaded:', loadedQuestions);
        questions = loadedQuestions;
        startQuiz(); // Start the quiz after questions are loaded
    } catch (error) {
        console.error('Error loading questions:', error);
        throw error; // Rethrow the error to handle it outside
    }
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


async function showSummary() {

    try {
        // Send a POST request to save the game record
        const response = await fetch('/saveGameRecord', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: user.user_id, score: score }),
        });

        if (response.ok) {
            const savedGameRecord = await response.json();
            console.log('Game record saved:', savedGameRecord);
        } else {
            console.error('Error saving game record:', response.statusText);
        }
    } catch (error) {
        console.error('Error saving game record:', error);
    }

    document.getElementById('start-screen').classList.add('hidden');
    var modal = document.getElementById("summary-modal");
    var span = document.getElementsByClassName("close-button")[0];

    // Clear the previous summary content
    var summaryResults = document.getElementById("summary-results");
    summaryResults.innerHTML = "<h2>Congratulations! Your Quiz is Complete!</h2>"; // Add congratulations message

    // Add detailed results to the summary
    results.forEach((result, index) => {
        const resultElement = document.createElement('p');
        resultElement.textContent = `Question ${index + 1}: ${result.question} - Your Answer: ${result.answer} (${result.isCorrect ? 'Correct' : 'Incorrect'})`;
        summaryResults.appendChild(resultElement);
    });

    // Display the final score
    var summaryFinalScore = document.getElementById("summary-final-score");
    summaryFinalScore.textContent = `Final Score: ${score}`;

    // Add a restart button
    var restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Quiz';
    restartButton.onclick = restartQuiz; // Restart quiz when button is clicked
    summaryResults.appendChild(restartButton);

    // Display the modal
    modal.style.display = "block";

    // Close the modal when the 'x' is clicked
    span.onclick = function() {
        modal.style.display = "none";
    };

    // Close the modal when clicked outside of the modal content
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

async function restartQuiz() {
    // Reset quiz state
    currentQuestionIndex = 0;
    score = 0;
    results = [];
    questions = [];

    // Hide the summary modal and show the start screen
    var modal = document.getElementById("summary-modal");
    modal.style.display = "none";
    document.getElementById('start-screen').classList.remove('hidden');

    // Reset UI elements on question screen
    document.getElementById('question-screen').classList.add('hidden'); // Question screen should remain hidden
    document.getElementById('score').textContent = 'Score: 0';
    document.getElementById('progress').textContent = 'Question 1 of X'; // Update X to the total number of questions
    document.getElementById('timer').textContent = 'Time Remaining: 30s';

    // Clear previous question and answer buttons
    document.getElementById('question').textContent = '';
    const answerButtonsElement = document.getElementById('answer-buttons');
    answerButtonsElement.innerHTML = '';

    // Optionally, reset player's name and year input fields
    document.getElementById('player-name').value = '';
    document.getElementById('player-year').value = '';

    try {
        // Load questions and start the quiz
        await loadQuestions();
    } catch (error) {
        console.error('Error restarting quiz:', error);
        // Handle the error if necessary
    }
}
    
    