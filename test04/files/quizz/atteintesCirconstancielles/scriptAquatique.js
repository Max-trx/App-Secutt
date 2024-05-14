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
    "text": "Qu'est-ce qu'un accident lié à la plongée ?",
    "answers": [
        {
            "text": "Une manifestation qui survient pendant une plongée en apnée uniquement.",
            "isCorrect": false,
            "comment": "Les accidents de plongée ne se limitent pas à la plongée en apnée."
        },
        {
            "text": "Une manifestation qui survient après une plongée en scaphandre autonome uniquement.",
            "isCorrect": false,
            "comment": "Les accidents de plongée ne se limitent pas à la plongée en scaphandre autonome."
        },
        {
            "text": "Une manifestation qui survient pendant, immédiatement après ou dans les vingt-quatre heures qui suivent une plongée en apnée ou en scaphandre autonome.",
            "isCorrect": true,
            "comment": "Un accident de plongée peut survenir pendant, immédiatement après ou jusqu'à 24 heures après une plongée en apnée ou en scaphandre autonome."
        },
        {
            "text": "Toutes les réponses précédentes sont correctes.",
            "isCorrect": false,
            "comment": "Seule la troisième réponse est correcte pour définir un accident lié à la plongée."
        }
    ]
},
{
  "text": "Qu'est-ce qu'un accident barotraumatique ?",
  "answers": [
      {
          "text": "Un accident provoqué par une variation des volumes de gaz dans les cavités naturelles et pathologiques de l'organisme.",
          "isCorrect": true,
          "comment": "Un accident barotraumatique est provoqué par une variation des volumes de gaz dans les cavités naturelles et pathologiques de l'organisme."
      },
      {
          "text": "Un accident toxique dû à une exposition à des gaz contaminants.",
          "isCorrect": false,
          "comment": "Ce type d'accident n'est pas appelé barotraumatique."
      },
      {
          "text": "Un accident provoqué par une insensibilité à la baisse de la quantité d'oxygène dans le sang.",
          "isCorrect": false,
          "comment": "Ce type d'accident n'est pas appelé barotraumatique."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Seule la première réponse est correcte pour définir un accident barotraumatique."
      }
  ]
},

{
  "text": "Qu'est-ce qui peut entraîner une surpression pulmonaire lors de la remontée en plongée ?",
  "answers": [
      {
          "text": "Un blocage de l'inspiration.",
          "isCorrect": false,
          "comment": "Un blocage de l'inspiration ne provoque pas une surpression pulmonaire lors de la remontée en plongée."
      },
      {
          "text": "Une expiration insuffisante.",
          "isCorrect": true,
          "comment": "Une expiration insuffisante peut entraîner une surpression pulmonaire lors de la remontée en plongée."
      },
      {
          "text": "Une brusque inspiration.",
          "isCorrect": false,
          "comment": "Une brusque inspiration n'est pas la cause principale de la surpression pulmonaire lors de la remontée en plongée."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Seule la deuxième réponse est correcte pour décrire ce qui peut entraîner une surpression pulmonaire lors de la remontée en plongée."
      }
  ]
},


{
  "text": "Qu'est-ce que l'hyperventilation préalable à la plongée en apnée peut provoquer ?",
  "answers": [
      {
          "text": "Une insensibilité à la baisse de la quantité d'oxygène dans le sang.",
          "isCorrect": true,
          "comment": "L'hyperventilation préalable à la plongée en apnée peut provoquer une insensibilité à la baisse de la quantité d'oxygène dans le sang."
      },
      {
          "text": "Une augmentation de la sensibilité à l'oxygène.",
          "isCorrect": false,
          "comment": "L'hyperventilation ne conduit généralement pas à une augmentation de la sensibilité à l'oxygène."
      },
      {
          "text": "Une augmentation de la pression artérielle.",
          "isCorrect": false,
          "comment": "L'hyperventilation ne provoque pas nécessairement une augmentation de la pression artérielle."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": false,
          "comment": "Seule la première réponse est correcte pour décrire ce que peut provoquer l'hyperventilation préalable à la plongée en apnée."
      }
  ]
},

{
  "text": "Quels signes peuvent indiquer la présence d'un accident de plongée ?",
  "answers": [
      {
          "text": "Des troubles de la parole.",
          "isCorrect": false,
          "comment": "Les troubles de la parole ne sont pas spécifiques aux accidents de plongée."
      },
      {
          "text": "Des troubles de la vision.",
          "isCorrect": false,
          "comment": "Les troubles de la vision ne sont pas spécifiques aux accidents de plongée."
      },
      {
          "text": "Des convulsions.",
          "isCorrect": false,
          "comment": "Les convulsions peuvent indiquer un accident de plongée, mais il existe d'autres signes également."
      },
      {
          "text": "Toutes les réponses précédentes sont correctes.",
          "isCorrect": true,
          "comment": "Les troubles de la parole, de la vision et les convulsions peuvent tous indiquer la présence d'un accident de plongée."
      }
  ]
},



{
  "text": "Que doit-on faire en premier lors de l'action de secours pour une victime d'accident de plongée ?",
  "answers": [
      {
          "text": "Lui administrer de l'oxygène.",
          "isCorrect": false,
          "comment": "Administrer de l'oxygène peut être important, mais la première priorité est de sortir la victime de l'eau."
      },
      {
          "text": "Lui donner à boire.",
          "isCorrect": false,
          "comment": "Lui donner à boire n'est pas une mesure appropriée en cas d'accident de plongée."
      },
      {
          "text": "La sortir de l'eau.",
          "isCorrect": true,
          "comment": "La première action à entreprendre lors d'un accident de plongée est de sortir la victime de l'eau pour éviter l'asphyxie."
      },
      {
          "text": "Alerter les autorités.",
          "isCorrect": false,
          "comment": "Alerter les autorités est important, mais la première priorité est de sortir la victime de l'eau."
      }
  ]
},


{
  "text": "Quel est l'objectif principal de l'administration d'oxygène à une victime d'accident de plongée ?",
  "answers": [
      {
          "text": "Réduire la douleur.",
          "isCorrect": false,
          "comment": "L'administration d'oxygène vise principalement à limiter l'évolution et l'extension des lésions, pas à réduire la douleur."
      },
      {
          "text": "Améliorer la respiration.",
          "isCorrect": false,
          "comment": "Bien que l'oxygène puisse aider à améliorer la respiration, son objectif principal est différent."
      },
      {
          "text": "Éviter la formation de bulles de gaz.",
          "isCorrect": false,
          "comment": "L'oxygène ne vise pas spécifiquement à éviter la formation de bulles de gaz, mais plutôt à limiter les dommages causés par celles-ci."
      },
      {
          "text": "Limiter l'évolution et l'extension des lésions.",
          "isCorrect": true,
          "comment": "L'objectif principal de l'administration d'oxygène est de limiter l'évolution et l'extension des lésions chez une victime d'accident de plongée."
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
