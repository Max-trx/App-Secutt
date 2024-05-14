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
  // Questions sur la crise convulsive généralisée

// Question 1
{
  text: "Qu'est-ce qu'une crise convulsive généralisée ?",
  answers: [
    { text: "Une perturbation de l'activité électrique cérébrale se traduisant par des mouvements musculaires incontrôlés.", isCorrect: true },
    { text: "Un arrêt cardiaque soudain.", isCorrect: false },
    { text: "Une perte de connaissance due à un traumatisme crânien.", isCorrect: false }
  ]
},

// Question 2
{
  text: "Quelles peuvent être les causes d'une crise convulsive généralisée ?",
  answers: [
    { text: "Le traumatisme crânien, certaines maladies, l'épilepsie, l'hypoglycémie, l'absorption de poisons.", isCorrect: true },
    { text: "Une insolation prolongée.", isCorrect: false },
    { text: "Une carence en vitamines.", isCorrect: false }
  ]
},

// Question 3
{
  text: "Quels sont les signes caractéristiques d'une crise convulsive généralisée ?",
  answers: [
    { text: "Perte brutale de connaissance, raideur musculaire, secousses involontaires, révulsion oculaire.", isCorrect: true },
    { text: "Maux de tête sévères et vision floue.", isCorrect: false },
    { text: "Fatigue extrême et confusion mentale.", isCorrect: false }
  ]
},

// Question 4
{
  text: "Qu'est-ce que l'état de mal convulsif ?",
  answers: [
    { text: "La succession de plusieurs crises convulsives sans reprise de conscience entre les crises.", isCorrect: true },
    { text: "Une amnésie temporaire après une crise convulsive.", isCorrect: false },
    { text: "Un état de confusion mentale prolongé.", isCorrect: false }
  ]
},

// Question 5
{
  text: "Quelle est la principale action à prendre au début d'une crise convulsive ?",
  answers: [
    { text: "Allonger la victime au sol pour éviter qu'elle ne se blesse en chutant.", isCorrect: true },
    { text: "Demander à la victime de se lever et de marcher pour stimuler la circulation sanguine.", isCorrect: false },
    { text: "Donner à la victime des médicaments pour calmer les convulsions.", isCorrect: false }
  ]
},

// Question 6
{
  text: "Que doit faire le secouriste pendant une crise convulsive ?",
  answers: [
    { text: "Protéger la tête de la victime, écarter les objets traumatisants, ne rien placer dans sa bouche.", isCorrect: true },
    { text: "Donner à la victime de l'oxygène pour faciliter sa respiration.", isCorrect: false },
    { text: "Maintenir la victime en position assise pour éviter qu'elle ne tombe.", isCorrect: false }
  ]
},

// Question 7
{
  text: "Que faire à la fin des convulsions d'une crise convulsive ?",
  answers: [
    { text: "Vérifier les voies aériennes de la victime, sa respiration, et l'installer en PLS si elle respire.", isCorrect: true },
    { text: "Laisser la victime seule pour qu'elle se repose.", isCorrect: false },
    { text: "Donner à la victime de l'eau pour qu'elle s'hydrate.", isCorrect: false }
  ]
},

// Question 8
{
  text: "Quelle mesure doit être réalisée après la phase convulsive d'une crise convulsive ?",
  answers: [
    { text: "Une mesure de la glycémie capillaire.", isCorrect: true },
    { text: "Une mesure de la pression artérielle.", isCorrect: false },
    { text: "Une prise de température corporelle.", isCorrect: false }
  ]
},

// Question 9
{
  text: "Quelle est la principale différence dans la prise en charge d'une crise convulsive chez un nourrisson ?",
  answers: [
    { text: "En plus des actions pour l'adulte, prendre la température de l'enfant et le ventiler en cas d'arrêt respiratoire.", isCorrect: true },
    { text: "Aucune différence significative dans la prise en charge.", isCorrect: false },
    { text: "Donner à l'enfant des médicaments pour calmer les convulsions.", isCorrect: false }
  ]
},

// Question 10
{
  text: "Quand doit-on transmettre un bilan après une crise convulsive ?",
  answers: [
    { text: "Immédiatement après avoir pris les premières mesures de secours.", isCorrect: true },
    { text: "Une fois que la victime est complètement rétablie.", isCorrect: false },
    { text: "Avant de commencer les gestes de secours.", isCorrect: false }
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
