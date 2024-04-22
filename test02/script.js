document.addEventListener('DOMContentLoaded', () => {
    // Replace 'questions.csv' with the path to your CSV file
    fetch('questions.csv')
        .then(response => response.text())
        .then(data => {
            const questions = parseCSV(data);
            displayQuestions(questions);
        })
        .catch(error => console.error('Error fetching questions:', error));
});

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');

    const questions = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const questionObj = {};

        for (let j = 0; j < headers.length; j++) {
            questionObj[headers[j].trim()] = values[j].trim();
        }

        questions.push(questionObj);
    }

    return questions;
}

function displayQuestions(questions) {
    const quizContainer = document.getElementById('quiz-container');

    questions.forEach(question => {
        const questionElement = document.createElement('div');
        questionElement.classList.add('question');
        questionElement.innerHTML = `
            <h3>${question.question}</h3>
            <ul>
                ${question.options.map(option => `<li>${option}</li>`).join('')}
            </ul>
            <p>Correct Answer: ${question.answer}</p>
            <hr>
        `;
        quizContainer.appendChild(questionElement);
    });
}
