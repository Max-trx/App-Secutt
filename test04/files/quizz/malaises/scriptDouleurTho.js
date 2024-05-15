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
  // Questions sur la douleur thoracique (non traumatique)

// Question 1
{
  text: "Qu'est-ce que la douleur thoracique ?",
  answers: [
    { text: "Une douleur perçue au niveau du thorax.", isCorrect: true },
    { text: "Une douleur ressentie dans le bas du dos.", isCorrect: false },
    { text: "Une douleur localisée dans les membres supérieurs.", isCorrect: false }
  ]
},

// Question 2
{
  text: "Quelles sont les principales causes de douleur thoracique non traumatique ?",
  answers: [
    { text: "Fracture des côtes, blessure au sternum, contusion pulmonaire.", isCorrect: false },
    { text: "Occlusion d'une artère coronaire, infection pulmonaire, reflux gastro-œsophagien.", isCorrect: true },
    { text: "Maux de tête, douleurs abdominales, engourdissement des membres.", isCorrect: false }
  ]
},

// Question 3
{
  text: "Quels signes peuvent accompagner la douleur thoracique ?",
  answers: [
    { text: "Vertiges, troubles de la vision, perte d'équilibre.", isCorrect: false },
    { text: "Picotements dans les bras, sensation de chaleur dans les jambes.", isCorrect: false },
    { text: "Malaise, pâleur, sueurs, nausées.", isCorrect: true }
  ]
},

// Question 4
{
  text: "Quel est le principal risque associé à une douleur thoracique ?",
  answers: [
    { text: "Atteinte des fonctions vitales, comme un infarctus ou une détresse respiratoire.", isCorrect: true },
    { text: "Risque de fracture des côtes ou de blessure au sternum.", isCorrect: false },
    { text: "Possibilité de développer une allergie alimentaire.", isCorrect: false }
  ]
},

// Question 5
{
  text: "Comment la douleur thoracique peut-elle évoluer dans le temps ?",
  answers: [
    { text: "Elle diminue progressivement avec le temps.", isCorrect: false },
    { text: "Elle peut être continue ou intermittente, et sa durée doit être précisée.", isCorrect: true },
    { text: "Elle s'aggrave brusquement sans prévenir.", isCorrect: false }
  ]
},

// Question 6
{
  text: "Que doit faire le secouriste en cas de douleur thoracique chez une victime consciente ?",
  answers: [
    { text: "Administer un médicament anti-inflammatoire sans demander l'avis de la victime.", isCorrect: false },
    { text: "Appliquer immédiatement un massage cardiaque.", isCorrect: false },
    { text: "Préserver les fonctions vitales, demander un avis médical, aider la victime à prendre un traitement si nécessaire.", isCorrect: true }
  ]
},

// Question 7
{
  text: "Quelles sont les positions recommandées pour une victime de douleur thoracique ?",
  answers: [
    { text: "Assise ou demi-assise.", isCorrect: true },
    { text: "Allongée sur le ventre.", isCorrect: false },
    { text: "Allongée sur le dos les jambes relevées.", isCorrect: false }
  ]
},

// Question 8
{
  text: "Que doit faire le secouriste si la victime perd conscience lors de douleurs thoraciques ?",
  answers: [
    { text: "Attendre que la victime reprenne conscience naturellement.", isCorrect: false },
    { text: "Appliquer la conduite à tenir adaptée et réaliser en priorité les gestes d'urgence qui s'imposent.", isCorrect: true },
    { text: "Administer un médicament contre la douleur.", isCorrect: false }
  ]
},

// Question 9
{
  text: "Pourquoi est-il important de demander un avis médical en cas de douleur thoracique ?",
  answers: [
    { text: "Pour prescrire un traitement sans tenir compte de la gravité de la situation.", isCorrect: false },
    { text: "Pour obtenir des conseils sur la relaxation.", isCorrect: false },
    { text: "Pour évaluer la gravité de la situation et orienter la prise en charge appropriée.", isCorrect: true }
  ]
},

// Question 10
{
  text: "Quelles sont les premières mesures à prendre en cas de douleur thoracique chez une victime consciente et en détresse respiratoire ?",
  answers: [
    { text: "Appliquer la conduite à tenir adaptée à une détresse respiratoire (position assise ou demi-assise, oxygène si nécessaire) et demander un avis médical.", isCorrect: true },
    { text: "Appliquer la conduite à tenir adaptée à une détresse circulatoire (position allongée horizontale, oxygène si nécessaire) et demander un avis médical.", isCorrect: false },
    { text: "Mettre la victime au repos immédiatement et lui administrer un médicament contre la douleur.", isCorrect: false }
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
