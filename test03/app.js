let currentQuestionIndex = 0;
let questions = [];

function loadQuestions() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const csvData = xhr.responseText;
            const rows = csvData.split('\n');
            questions = rows.map(row => row.split(','));
            displayQuestion();
        } else if (xhr.readyState === 4 && xhr.status !== 200) {
            console.error('Error loading questions. Status:', xhr.status);
        }
    };

    xhr.open('GET', 'questions.csv', true);
    xhr.send();
}

function displayQuestion() {
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = questions[currentQuestionIndex][0];
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        alert('Quiz completed!');
        currentQuestionIndex = 0; // Reset for future quizzes
        displayQuestion();
    }
}

// Load questions when the page loads
loadQuestions();
