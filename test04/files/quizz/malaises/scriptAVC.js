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
  // Questions sur l'AVC

// Question 1
{
  text: "Qu'est-ce qu'un accident vasculaire cérébral (AVC) ?",
  answers: [
    { text: "Une rupture d'un vaisseau sanguin dans le cerveau.", isCorrect: false },
    { text: "Un déficit neurologique soudain d'origine vasculaire.", isCorrect: true },
    { text: "Une perte de conscience brève et passagère.", isCorrect: false }
  ]
},

// Question 2
{
  text: "Quelle est la principale cause d'AVC ?",
  answers: [
    { text: "L'obstruction d'une artère cérébrale.", isCorrect: true },
    { text: "Une hémorragie cérébrale.", isCorrect: false },
    { text: "Une perte de connaissance due à une maladie.", isCorrect: false }
  ]
},

// Question 3
{
  text: "Quels sont les signes spécifiques d'un AVC selon le FAST test ?",
  answers: [
    { text: "Fatigue, Appetite et Stress.", isCorrect: false },
    { text: "Fever, Arm et Spasm.", isCorrect: false },
    { text: "Face, Arm et Speech (langage).", isCorrect: true }
  ]
},

// Question 4
{
  text: "Quelle est la première cause de handicap chez l'adulte ?",
  answers: [
    { text: "L'accident vasculaire cérébral (AVC).", isCorrect: true },
    { text: "Les troubles cardiaques.", isCorrect: false },
    { text: "Les accidents de voiture.", isCorrect: false }
  ]
},

// Question 5
{
  text: "Que doit faire un secouriste si une victime présente des signes d'AVC ?",
  answers: [
    { text: "Attendre que les symptômes disparaissent d'eux-mêmes.", isCorrect: false },
    { text: "Demander un avis médical immédiat et respecter les consignes.", isCorrect: true },
    { text: "Donner à la victime des médicaments contre la douleur.", isCorrect: false }
  ]
},

// Question 6
{
  text: "Quels sont les trois signes spécifiques recherchés chez une victime d'AVC ?",
  answers: [
    { text: "Toux persistante, fièvre élevée, fatigue extrême.", isCorrect: false },
    { text: "Douleur abdominale, difficulté de respiration, vertiges.", isCorrect: false },
    { text: "Déformation de la bouche, faiblesse ou engourdissement des bras, difficulté de langage.", isCorrect: true }
  ]
},

// Question 7
{
  text: "Quel est le principe de l'action de secours pour une victime d'AVC ?",
  answers: [
    { text: "Demander un avis médical immédiat, surveiller la victime et respecter les consignes.", isCorrect: true },
    { text: "Donner des médicaments pour réduire la pression artérielle.", isCorrect: false },
    { text: "Mettre la victime en position assise et lui donner de l'oxygène.", isCorrect: false }
  ]
},

// Question 8
{
  text: "Quelle est la meilleure prise en charge pour les victimes d'AVC ?",
  answers: [
    { text: "Les acheminer vers un centre spécialisé en unité neuro-vasculaire.", isCorrect: true },
    { text: "Les traiter à domicile avec des médicaments.", isCorrect: false },
    { text: "Les envoyer dans n'importe quel hôpital proche.", isCorrect: false }
  ]
},

// Question 9
{
  text: "Quel est l'effet de l'interruption de la circulation sanguine pendant un AVC ?",
  answers: [
    { text: "Un afflux excessif de sang dans le cerveau, provoquant des saignements.", isCorrect: false },
    { text: "Une ischémie des cellules nerveuses, suivie de leur détérioration et de leur mort.", isCorrect: true },
    { text: "Une augmentation de l'oxygénation du cerveau, améliorant la santé des cellules nerveuses.", isCorrect: false }
  ]
},

// Question 10
{
  text: "Qu'est-ce qu'un accident ischémique transitoire (AIT) ?",
  answers: [
    { text: "Une obstruction de l'artère cérébrale se résorbant d'elle-même avec des signes passagers.", isCorrect: true },
    { text: "Une hémorragie cérébrale permanente entraînant des séquelles.", isCorrect: false },
    { text: "Une perte de conscience prolongée due à une hypoxie cérébrale.", isCorrect: false }
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
