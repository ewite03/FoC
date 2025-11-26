function fetchJoke() {
    const resultDiv = document.getElementById('joke-result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = 'Loading joke...';
    
    fetch('https://official-joke-api.appspot.com/random_joke')
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `
                <strong>Joke:</strong><br>
                ${data.setup}<br><br>
                <strong>Punchline:</strong><br>
                ${data.punchline}
            `;
        })
        .catch(error => {
            resultDiv.innerHTML = 'Sorry, could not fetch a joke. Please try again!';
            console.error('Error:', error);
        });
}

const osQuestions = [
    {
        question: "When was the first operating system created?",
        options: ["1950s", "1970s", "1980s", "1990s"],
        correct: 0,
        explanation: "The first operating systems were created in the 1950s to manage batch processing on early computers."
    },
    {
        question: "Which company created the UNIX operating system?",
        options: ["Microsoft", "Apple", "Bell Labs", "IBM"],
        correct: 2,
        explanation: "UNIX was created at Bell Labs in 1969 by Ken Thompson and Dennis Ritchie."
    },
    {
        question: "What does GUI stand for in operating systems?",
        options: ["General User Interface", "Graphical User Interface", "Global Unified Integration", "General Usage Indicator"],
        correct: 1,
        explanation: "GUI stands for Graphical User Interface, which allows users to interact with computers using visual elements like windows and icons."
    },
    {
        question: "Which operating system is open source and free?",
        options: ["Windows", "macOS", "Linux", "iOS"],
        correct: 2,
        explanation: "Linux is an open-source operating system, meaning its source code is freely available for anyone to view, modify, and distribute."
    },
    {
        question: "Which company created the Windows operating system?",
        options: ["Apple", "Microsoft", "IBM", "Google"],
        correct: 1,
        explanation: "Microsoft created the Windows operating system. The first version was released in 1985 as a graphical user interface for MS-DOS."
    }
];

let currentQuestion = 0;
let score = 0;
let streak = 0;
let timerInterval = null;
let timeLeft = 10;

function startGame() {
    document.getElementById('game-intro').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('game-end').style.display = 'none';
    currentQuestion = 0;
    score = 0;
    streak = 0;
    showQuestion();
}

function updateProgress() {
    const percentage = ((currentQuestion + 1) / 5) * 100;
    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-fill').textContent = Math.round(percentage) + '%';
}

function startTimer() {
    timeLeft = 100;
    updateTimerDisplay();
    
    if (timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            autoSubmitAnswer();
        }
    }, 100);
}

function updateTimerDisplay() {
    document.getElementById('timer-text').textContent = (timeLeft / 10).toFixed(1);
    const fillPercent = (timeLeft / 100) * 100;
    document.getElementById('timer-fill').style.width = fillPercent + '%';
}

function autoSubmitAnswer() {
    const buttons = document.querySelectorAll('.game-options button');
    buttons.forEach(button => button.disabled = true);
    
    const feedback = document.getElementById('feedback');
    const q = osQuestions[currentQuestion];
    
    streak = 0;
    document.getElementById('streak').style.display = 'none';
    
    feedback.innerHTML = `
        <div class="feedback-message incorrect">
            <strong>TIME'S UP!</strong><br>
            You ran out of time! The correct answer was: <strong>${q.options[q.correct]}</strong>
            <div class="explanation">${q.explanation}</div>
        </div>
    `;
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < osQuestions.length) {
            showQuestion();
        } else {
            endGame();
        }
    }, 3500);
}

function showQuestion() {
    if (timerInterval) clearInterval(timerInterval);
    
    const q = osQuestions[currentQuestion];
    document.getElementById('question').textContent = q.question;
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('current-score').textContent = score;
    updateProgress();
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = '';
    
    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(index, button);
        optionsDiv.appendChild(button);
    });
    
    startTimer();
}

function checkAnswer(selected, buttonElement) {
    if (timerInterval) clearInterval(timerInterval);
    
    const q = osQuestions[currentQuestion];
    const feedback = document.getElementById('feedback');
    const buttons = document.querySelectorAll('.game-options button');
    
    buttons.forEach(button => button.disabled = true);
    
    if (selected === q.correct) {
        score++;
        streak++;
        buttonElement.style.background = '#28a745';
        buttonElement.style.color = 'white';
        buttonElement.style.borderColor = '#28a745';
        
        if (streak > 0) {
            document.getElementById('streak').style.display = 'inline-block';
            document.getElementById('streak-count').textContent = streak;
        }
        
        feedback.innerHTML = `
            <div class="feedback-message correct">
                <strong>CORRECT!</strong><br>
                You got it right!
                <div class="explanation">${q.explanation}</div>
            </div>
        `;
    } else {
        buttonElement.style.background = '#dc3545';
        buttonElement.style.color = 'white';
        buttonElement.style.borderColor = '#dc3545';
        
        const correctButton = buttons[q.correct];
        correctButton.style.background = '#28a745';
        correctButton.style.color = 'white';
        correctButton.style.borderColor = '#28a745';
        
        streak = 0;
        document.getElementById('streak').style.display = 'none';
        
        feedback.innerHTML = `
            <div class="feedback-message incorrect">
                <strong>INCORRECT!</strong><br>
                The correct answer was: <strong>${q.options[q.correct]}</strong>
                <div class="explanation">${q.explanation}</div>
            </div>
        `;
    }
    
    document.getElementById('current-score').textContent = score;
    
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < osQuestions.length) {
            showQuestion();
        } else {
            endGame();
        }
    }, 3500);
}

function endGame() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('game-end').style.display = 'block';
    document.getElementById('final-score').textContent = score + '/5';
    
    let message = '';
    let emoji = '';
    
    if (score === 5) {
        message = '🏆 PERFECT! You are an OS History Master! 🏆<br>You got every question right! Incredible!';
        emoji = '👑';
    } else if (score === 4) {
        message = '🎉 EXCELLENT! You almost mastered OS History! 🎉<br>4 out of 5 is fantastic!';
        emoji = '⭐';
    } else if (score === 3) {
        message = '👍 GOOD JOB! You know your OS History! 👍<br>Keep learning and try again!';
        emoji = '💪';
    } else if (score === 2) {
        message = '📚 NOT BAD! You learned something today! 📚<br>Play again and improve your score!';
        emoji = '🎓';
    } else {
        message = '💡 KEEP LEARNING! Operating systems have a fascinating history! 💡<br>Try again to boost your score!';
        emoji = '🚀';
    }
    
    document.getElementById('result-message').innerHTML = emoji + '<br>' + message;
}
