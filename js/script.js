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

function startQuiz(playerName) {
    // Hide start screen and show question screen
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-screen').classList.remove('hidden');

    // Load first question
    loadQuestion();
}

function loadQuestion() {
    // This function would fetch questions from the backend and display them
    // For now, we'll just display a dummy question and answers
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const nextButton = document.getElementById('next-btn');

    questionElement.textContent = "What is 2 + 2?";
    answerButtonsElement.innerHTML = `
        <button class="btn">1</button>
        <button class="btn">2</button>
        <button class="btn">3</button>
        <button class="btn">4</button>
    `;

    answerButtonsElement.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const selectedAnswer = event.target.textContent;
            if(selectedAnswer === "4") {
                alert("Correct!");
            } else {
                alert("Wrong!");
            }
            nextButton.classList.remove('hidden');
        });
    });

    nextButton.addEventListener('click', showSummary);
}

function showSummary() {
    // Hide question screen and show summary screen
    document.getElementById('question-screen').classList.add('hidden');
    document.getElementById('summary-screen').classList.remove('hidden');

    // Show final score, for now it's just a placeholder
    document.getElementById('final-score').textContent = "You scored: X points";
}

// We would have additional functions to handle feedback submission and leaderboard display
