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
    "text": "Quels sont les principaux objectifs de la transmission du bilan selon les informations fournies ?",
    "answers": [
        {
            text: "Demander un avis médical, demander du renfort, définir l’orientation de la victime et réaliser un relai.",
            isCorrect: true,
            comment: "Effectivement, la transmission du bilan vise à accomplir ces objectifs selon les informations fournies."
        },
        {
            text: "Réaliser un examen détaillé de la victime et mesurer les paramètres physiologiques.",
            isCorrect: false,
            comment: "Non, la transmission du bilan concerne la communication des informations sur l'intervention et l'état de la victime, pas la réalisation d'un examen détaillé ou la mesure des paramètres physiologiques."
        },
        {
            text: "Assurer la sécurité des intervenants et de la victime.",
            isCorrect: false,
            comment: "Ce n'est pas le but principal de la transmission du bilan, même si cela peut en découler indirectement."
        },
        {
            text: "Donner des instructions spécifiques sur les gestes de secours à entreprendre.",
            isCorrect: false,
            comment: "La transmission du bilan vise à communiquer des informations sur l'intervention déjà entreprise, pas à donner des instructions spécifiques sur les gestes de secours à entreprendre."
        }
    ]
},
{
    "text": "Que doit contenir la transmission du bilan pour une situation nécessitant immédiatement des moyens en renfort ?",
    "answers": [
        {
            text: "La nature de l’intervention, les moyens déjà présents sur place, les moyens supplémentaires nécessaires et éventuellement la correction d'informations erronées.",
            isCorrect: true,
            comment: "Oui, dans une situation nécessitant des moyens en renfort, la transmission du bilan doit inclure ces éléments selon les informations fournies."
        },
        {
            text: "Un compte-rendu détaillé de l'ensemble de l'intervention.",
            isCorrect: false,
            comment: "Non, dans une situation nécessitant des moyens en renfort, la transmission du bilan doit être particulièrement descriptive de la situation, mais elle ne nécessite pas nécessairement un compte-rendu détaillé de l'ensemble de l'intervention."
        },
        {
            text: "Les antécédents médicaux complets de la victime.",
            isCorrect: false,
            comment: "La transmission du bilan ne nécessite pas les antécédents médicaux complets de la victime, mais plutôt des informations spécifiques liées à la situation actuelle."
        },
        {
            text: "Des recommandations sur les gestes de secours à entreprendre.",
            isCorrect: false,
            comment: "La transmission du bilan ne se concentre pas sur les recommandations futures, mais sur la communication des informations pertinentes pour la situation actuelle."
        }
    ]
},
{
    "text": "Que doit inclure la transmission du bilan pour une victime ne présentant pas de détresse vitale ?",
    "answers": [
        {
            text: "Le motif réel de l’intervention, le sexe et l’âge de la victime, la plainte principale, le résultat du bilan et les gestes de secours entrepris.",
            isCorrect: true,
            comment: "Oui, dans ce cas, la transmission du bilan doit inclure ces éléments spécifiques selon les informations fournies."
        },
        {
            text: "Un appel à une équipe de renfort médical.",
            isCorrect: false,
            comment: "Cela ne fait pas partie des éléments nécessaires pour la transmission du bilan dans ce contexte."
        },
        {
            text: "Des détails sur les antécédents médicaux complets de la victime.",
            isCorrect: false,
            comment: "La transmission du bilan ne nécessite pas les antécédents médicaux complets de la victime, mais plutôt des informations spécifiques liées à la situation actuelle."
        },
        {
            text: "Les instructions spécifiques sur les gestes de secours à entreprendre pour la suite de l'intervention.",
            isCorrect: false,
            comment: "La transmission du bilan se concentre sur la communication des informations pertinentes pour la situation actuelle, pas sur les instructions futures."
        }
    ]
},
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
