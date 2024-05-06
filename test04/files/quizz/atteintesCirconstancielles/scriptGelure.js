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
  {
    text: "Qu’elle est la défnition d'une gelure ?",
    answers: [
      { text: "Un saignement qui ne s'arrête pas", isCorrect: false, comment: "Ce n'est pas correct. Une gelure est une lésion grave de la peau liée au froid." },
      { text: "Une lésion grave de la peau liée au froid", isCorrect: true, comment: "Une gelure est en effet une lésion de la peau causée par le froid." },
      { text: "Une douleur des cervicales", isCorrect: false, comment: "Non, ce n'est pas une gelure. Il s'agit d'autre chose." },
      { text: "Une douleur des cervicales", isCorrect: false, comment: "Non, ce n'est pas une gelure. Il s'agit d'autre chose." }
    ]
  },
  {
    text: "Dans quelle(s) condition(s) surviennent les gelures ?",
    answers: [
      { text: "Lors d’une exposition prolongée dans un milieu froid, en dessous de 0°C", isCorrect: true },
      { text: "Lors d’une exposition de 5 min dans un milieu froid -10°C", isCorrect: false },
      { text: "Lors ce que je vais dans un milieu chaud", isCorrect: false },
      { text: "Lors ce que je vais dans un milieu chaud", isCorrect: false }
    ]
  },
  {
    text: "Combien de degré de gelure existe-il ?",
    answers: [
      { text: "3 sachant que dans le cas le plus grave il y a un risque d’amputation", isCorrect: false },
      { text: "4 et l’apparition des 1er cloques s’effectue au 3eme degré", isCorrect: true },
      { text: "4 et l’apparition des cloques sanglantes se manifeste au 3eme degré", isCorrect: false },
      { text: "4 et l’amputation est irréversible dans le pire cas", isCorrect: false }
    ]
  },
  {
    text: "Sous quelles conditions pouvons-nous plonger les gelures dans une bassine d’eau à 37-39°C ?",
    answers: [
      { text: "Uniquement sous 10h", isCorrect: false },
      { text: "Uniquement sous 24h", isCorrect: false },
      { text: "S’il n’y a pas de risque de réexposition au froid", isCorrect: true },
      { text: "Pas plus de 20min immergées", isCorrect: false }
    ]
  },
  {
      text: "Pourquoi est-il important de repérer la présence d'une poche d'air lors du dégagement de la tête de la victime ensevelie ?",
      answers: [
          {
              text: "Pour décider si la victime doit être évacuée rapidement",
              isCorrect: false,
              comment: "Incorrect. L'évaluation de la poche d'air est importante pour adapter la conduite à tenir, mais cela ne détermine pas nécessairement la nécessité d'une évacuation rapide."
          },
          {
              text: "Pour évaluer l'ampleur des lésions traumatiques",
              isCorrect: false,
              comment: "Incorrect. Bien que l'évaluation des lésions soit importante, la présence d'une poche d'air est plus pertinente pour fournir une ventilation efficace."
          },
          {
              text: "Pour déterminer si la victime est encore consciente",
              isCorrect: false,
              comment: "Incorrect. La présence d'une poche d'air n'est pas nécessairement liée à la conscience de la victime. Elle est importante pour fournir de l'oxygène si nécessaire."
          },
          {
              text: "Pour adapter la conduite à tenir et fournir de l'oxygène si nécessaire",
              isCorrect: true,
              comment: "Correct. Repérer une poche d'air permet d'adapter la prise en charge de la victime et de fournir de l'oxygène pour prévenir l'asphyxie."
          }
      ]
  },
  {
      text: "Quel est l'un des mécanismes de traumatismes subis par une victime ensevelie dans une avalanche ?",
      answers: [
          {
              text: "L'écrasement par la neige compacte",
              isCorrect: false,
              comment: "Incorrect. L'écrasement est un mécanisme de traumatisme, mais les chocs contre des obstacles comme les rochers ou les arbres sont également fréquents."
          },
          {
              text: "La déshydratation due à l'exposition prolongée",
              isCorrect: false,
              comment: "Incorrect. La déshydratation peut être un problème, mais les traumatismes physiques sont plus immédiats et graves dans les premières minutes après l'avalanche."
          },
          {
              text: "Les brûlures causées par le frottement avec la neige",
              isCorrect: false,
              comment: "Incorrect. Les brûlures sont peu probables dans une avalanche. Les traumatismes sont généralement dus à des chocs contre des obstacles ou à l'asphyxie."
          },
          {
              text: "Les chocs directs contre les rochers ou les arbres",
              isCorrect: true,
              comment: "Correct. Les chocs contre des obstacles solides comme les rochers ou les arbres sont l'un des principaux mécanismes de traumatismes dans les avalanches."
          }
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
