document.addEventListener('DOMContentLoaded', function () {
    const questionContainer = document.getElementById('question-container');
    const nextBtn = document.getElementById('next-btn');
    let currentQuestionIndex = 0;
    let questions = [];

    // Fetch questions from CSV file
    fetch('C:\Users\max7f\Documents\App Secutt\test02\questions.csv')
        .then(response => response.text())
        .then(csvData => {
            questions = parseCSV(csvData);
            showQuestion();
        });

    nextBtn.addEventListener('click', showNextQuestion);

    function showQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        const options = currentQuestion.options.split(',').map(option => option.trim());
        const optionsHtml = options.map(option => `<label><input type="radio" name="answer" value="${option}">${option}</label>`).join('<br>');
        questionContainer.innerHTML = `
            <h2>${currentQuestion.question}</h2>
            ${optionsHtml}
        `;
    }
    

    function showNextQuestion() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (selectedAnswer) {
            // Process the answer
            const userAnswer = selectedAnswer.value;
            const currentQuestion = questions[currentQuestionIndex];
    
            // Check if the user's answer is correct
            if (userAnswer === currentQuestion.answer) {
                alert('Correct!'); // You can customize this message
                // Perform any other actions for a correct answer
            } else {
                alert(`Incorrect. The correct answer is: ${currentQuestion.answer}`);
                // Perform any other actions for an incorrect answer
            }
    
            // Move to the next question
            currentQuestionIndex++;
    
            // Check if there are more questions
            if (currentQuestionIndex < questions.length) {
                showQuestion();
            } else {
                alert('Quiz completed!'); // You can customize this message or redirect to another page
            }
        } else {
            alert('Please select an answer.');
        }
    }
    

    function parseCSV(csvData) {
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const currentLine = lines[i].split(',');
            const questionObj = {};

            for (let j = 0; j < headers.length; j++) {
                questionObj[headers[j]] = currentLine[j];
            }

            result.push(questionObj);
        }

        return result;
    }
});
