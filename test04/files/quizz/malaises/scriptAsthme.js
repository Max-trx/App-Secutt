//
// lib/lib.js
//
var Question = function (questionObj) {
  this.value = {
    text: "Question",
    answers: []
  };

  this.selectedAnswer = null;
  this.html = null;
  this.questionText = null;
  this.questionAnswers = null;
  this.questionFeedback = null;

  this.value = Object.assign(this.value, questionObj);

  this.onQuestionAnswered = ({ detail }) => {
    this.selectedAnswer = {
      value: detail.answer,
      html: detail.answerHtml
    };
    this.update();
  
    let feedbackText;
    if (detail.answer.isCorrect) {
      feedbackText = "Correct! ";
    } else {
      feedbackText = "Incorrect. ";
    }
    feedbackText += detail.answer.comment; // Ajouter le commentaire à la réponse
  
    this.questionFeedback.innerHTML = feedbackText;
  
    document.dispatchEvent(
      new CustomEvent("question-answered", {
        detail: {
          question: this,
          answer: detail.answer
        }
      })
    );
  };
  

  this.create = function () {
    this.html = document.createElement("div");
    this.html.classList.add("question");

    this.questionText = document.createElement("div");
    this.questionText.classList.add("titreQuestion");
    this.questionText.textContent = this.value.text;

    this.questionAnswers = document.createElement("div");
    this.questionAnswers.classList.add("answers");

    for (let i = 0; i < this.value.answers.length; i++) {
      const ansObj = this.value.answers[i];
      let answer = createAnswer(ansObj);

      answer.onclick = (ev) => {
        if (this.selectedAnswer !== null) {
          this.selectedAnswer.html.classList.remove("selected");
        }

        answer.classList.add("selected");

        this.html.dispatchEvent(
          new CustomEvent("question-answered", {
            detail: {
              answer: ansObj,
              answerHtml: answer
            }
          })
        );
      };

      this.questionAnswers.appendChild(answer);
    }

    this.questionFeedback = document.createElement("div");
    this.questionFeedback.classList.add("question-feedback");

    this.html.appendChild(this.questionText);
    this.html.appendChild(this.questionAnswers);
    this.html.appendChild(this.questionFeedback);

    this.html.addEventListener("question-answered", this.onQuestionAnswered);

    return this.html;
  };

  this.disable = function () {
    this.html.classList.add("disabled");
    this.html.onclick = (ev) => {
      ev.stopPropagation();
    };

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    let answers = this.html.querySelectorAll(".answer");
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      answer.onclick = null;
    }
  };

  this.remove = function () {
    let children = this.html.querySelectorAll("*");
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      this.html.removeChild(child);
    }

    this.html.removeEventListener("question-answered", this.onQuestionAnswered);

    this.html.parentNode.removeChild(this.html);
    this.html = null;
  };

  this.update = function () {
    let correctFeedback, incorrectFeedback;
    this.html = this.html || document.createElement("div");

    correctFeedback = "Exact !";
    incorrectFeedback = "Non.";

    if (this.selectedAnswer !== null) {
      if (this.selectedAnswer.value.isCorrect) {
        this.html.classList.add("correct");
        this.html.classList.remove("incorrect");
        this.questionFeedback.innerHTML = correctFeedback;
      } else {
        this.html.classList.add("incorrect");
        this.html.classList.remove("correct");
        this.questionFeedback.innerHTML = incorrectFeedback;
      }
    }
  };

  function createAnswer(obj) {
    this.value = {
      text: "Answer",
      isCorrect: false
    };

    this.value = Object.assign(this.value, obj);

    this.html = document.createElement("button");
    this.html.classList.add("answer");

    this.html.textContent = this.value.text;

    return this.html;
  }
};

//
// main.js
//

let questionsData = [
  // Questions sur la crise d'asthme

// Question 1
{
  text: "Qu'est-ce qu'une crise d'asthme ?",
  answers: [
    { text: "Un arrêt cardiaque soudain.", isCorrect: false },
    { text: "Une détresse respiratoire causée par une inflammation et une contraction des bronchioles.", isCorrect: true },
    { text: "Une infection virale des voies respiratoires.", isCorrect: false }
  ]
},

// Question 2
{
  text: "Quels sont les facteurs déclenchants d'une crise d'asthme ?",
  answers: [
    { text: "Le contact avec un allergène, une infection respiratoire, la pollution, l'effort physique.", isCorrect: true },
    { text: "La consommation excessive de sucre.", isCorrect: false },
    { text: "La pratique régulière d'exercices de relaxation.", isCorrect: false }
  ]
},

// Question 3
{
  text: "Quel est le rôle des médicaments dans la crise d'asthme ?",
  answers: [
    { text: "Ils stimulent le système immunitaire pour combattre l'inflammation.", isCorrect: false },
    { text: "Ils abaissent la pression artérielle pour réduire l'anxiété.", isCorrect: false },
    { text: "Ils relaxent les bronchioles pour faciliter la respiration.", isCorrect: true }
  ]
},

// Question 4
{
  text: "Quels sont les signes caractéristiques d'une crise d'asthme grave ?",
  answers: [
    { text: "Difficulté à parler, agitation, sifflement à l'expiration.", isCorrect: true },
    { text: "Fatigue extrême et confusion mentale.", isCorrect: false },
    { text: "Hypotension artérielle et pâleur cutanée.", isCorrect: false }
  ]
},

// Question 5
{
  text: "Que doit faire le secouriste en cas de crise d'asthme chez une victime consciente ?",
  answers: [
    { text: "Administre immédiatement de l'oxygène en inhalation.", isCorrect: false },
    { text: "Faciliter la respiration, aider la victime à prendre son traitement, demander un avis médical.", isCorrect: true  },
    { text: "Placer la victime en position couchée pour lui permettre de se reposer.", isCorrect: false }
  ]
},

// Question 6
{
  text: "Quelle est la position généralement recommandée pour une victime en crise d'asthme ?",
  answers: [
    { text: "Allongée sur le dos les jambes relevées.", isCorrect: false },
    { text: "Couchée sur le ventre.", isCorrect: false },
    { text: "Assise ou demi-assise.", isCorrect: true }
  ]
},

// Question 7
{
  text: "Quels sont les gestes à éviter lors de la prise en charge d'une crise d'asthme ?",
  answers: [
    { text: "Rien qui pourrait gêner la respiration de la victime.", isCorrect: true },
    { text: "Masser vigoureusement le dos de la victime.", isCorrect: false },
    { text: "Administrer de l'eau froide à boire à la victime.", isCorrect: false }
  ]
},

// Question 8
{
  text: "Que doit faire le secouriste si la victime perd connaissance lors d'une crise d'asthme ?",
  answers: [
    { text: "Administrer un médicament anti-allergique par voie orale.", isCorrect: false },
    { text: "Appliquer la conduite à tenir devant un arrêt cardiaque si la victime ne respire plus.", isCorrect: true },
    { text: "Demander à la victime de prendre des respirations profondes.", isCorrect: false }
  ]
},

// Question 9
{
  text: "Quelle est la principale recommandation pour aider une victime d'asthme à prendre son traitement ?",
  answers: [
    { text: "Administrer le traitement sans demander l'avis de la victime.", isCorrect: false },
    { text: "Demander à la victime de se calmer et de respirer profondément.", isCorrect: false },
    { text: "Rassurer la victime et l'aider à utiliser son aérosol doseur.", isCorrect: true }
  ]
},

// Question 10
{
  text: "Pourquoi est-il important de demander un avis médical en cas de crise d'asthme ?",
  answers: [
    { text: "Pour évaluer la gravité de la crise et ajuster le traitement si nécessaire.", isCorrect: true },
    { text: "Pour éviter que la victime ne développe une allergie aux médicaments.", isCorrect: false },
    { text: "Pour obtenir des conseils sur la gestion du stress.", isCorrect: false }
  ]
}

];


// variables initialization
let questions = [];
let score = 0,
  answeredQuestions = 0;
let appContainer = document.getElementById("questions-container");
let scoreContainer = document.getElementById("score-container");
scoreContainer.innerHTML = `Score: ${score}/${5}`;

/**
 * Shuffles array in place. ES6 version
 * @param {Array} arr items An array containing the items.
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

shuffle(questionsData);

// creating questions
for (var i = 0; i < 5; i++) {
  let question = new Question({
    text: questionsData[i].text,
    answers: questionsData[i].answers
  });

  appContainer.appendChild(question.create());
  questions.push(question);
}

document.addEventListener("question-answered", ({ detail }) => {
  if (detail.answer.isCorrect) {
    score++;
  }

  answeredQuestions++;
  scoreContainer.innerHTML = `Score: ${score}/${questions.length}`;
  detail.question.disable();

  if (answeredQuestions == questions.length) {
    setTimeout(function () {
      alert(`Quiz completed! \nFinal score: ${score}/${questions.length}`);
    }, 100);
  }
});

console.log(questions, questionsData);
