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
              comment: "L'évaluation de la poche d'air est importante pour adapter la conduite à tenir, mais cela ne détermine pas nécessairement la nécessité d'une évacuation rapide."
          },
          {
              text: "Pour évaluer l'ampleur des lésions traumatiques",
              isCorrect: false,
              comment: "Bien que l'évaluation des lésions soit importante, la présence d'une poche d'air est plus pertinente pour fournir une ventilation efficace."
          },
          {
              text: "Pour déterminer si la victime est encore consciente",
              isCorrect: false,
              comment: "La présence d'une poche d'air n'est pas nécessairement liée à la conscience de la victime. Elle est importante pour fournir de l'oxygène si nécessaire."
          },
          {
              text: "Pour adapter la conduite à tenir et fournir de l'oxygène si nécessaire",
              isCorrect: true,
              comment: "Repérer une poche d'air permet d'adapter la prise en charge de la victime et de fournir de l'oxygène pour prévenir l'asphyxie."
          }
      ]
  },
  {
      text: "Quel est l'un des mécanismes de traumatismes subis par une victime ensevelie dans une avalanche ?",
      answers: [
          {
              text: "L'écrasement par la neige compacte",
              isCorrect: false,
              comment: "L'écrasement est un mécanisme de traumatisme, mais les chocs contre des obstacles comme les rochers ou les arbres sont également fréquents."
          },
          {
              text: "La déshydratation due à l'exposition prolongée",
              isCorrect: false,
              comment: "La déshydratation peut être un problème, mais les traumatismes physiques sont plus immédiats et graves dans les premières minutes après l'avalanche."
          },
          {
              text: "Les brûlures causées par le frottement avec la neige",
              isCorrect: false,
              comment: "Les brûlures sont peu probables dans une avalanche. Les traumatismes sont généralement dus à des chocs contre des obstacles ou à l'asphyxie."
          },
          {
              text: "Les chocs directs contre les rochers ou les arbres",
              isCorrect: true,
              comment: "Les chocs contre des obstacles solides comme les rochers ou les arbres sont l'un des principaux mécanismes de traumatismes dans les avalanches."
          }
      ]
  },
  {
    "text": "Qu'est-ce que l'électrisation ?",
    "answers": [
        {
            "text": "L'ensemble des lésions provoquées par le passage d'un courant électrique à travers le corps.",
            "isCorrect": true,
            "comment": "L'électrisation désigne en effet l'ensemble des lésions causées par le passage du courant électrique à travers le corps."
        },
        {
            "text": "Un accident lié à la production d'un arc électrique.",
            "isCorrect": false,
            "comment": "Ce type d'accident est différent et n'est pas spécifiquement appelé électrisation."
        },
        {
            "text": "L'effet direct du courant électrique lorsqu'il traverse les tissus.",
            "isCorrect": false,
            "comment": "C'est une partie de l'électrisation, mais pas sa définition complète."
        },
        {
            "text": "Toutes les réponses précédentes sont correctes.",
            "isCorrect": false,
            "comment": "Seule la première réponse est correcte pour définir l'électrisation."
        }
    ]
},

{
    "text": "Qu'est-ce que l'électrocution ?",
    "answers": [
        {
            "text": "Une électrisation mortelle.",
            "isCorrect": true,
            "comment": "L'électrocution désigne une électrisation mortelle."
        },
        {
            "text": "Une électrisation temporaire.",
            "isCorrect": false,
            "comment": "L'électrocution n'est pas temporaire, c'est une condition mortelle."
        },
        {
            "text": "Une électrisation due à la production d'un arc électrique.",
            "isCorrect": false,
            "comment": "L'électrocution ne se limite pas à la production d'un arc électrique."
        },
        {
            "text": "Une électrisation provoquée par un courant continu.",
            "isCorrect": false,
            "comment": "L'électrocution n'est pas spécifiquement liée à un type particulier de courant électrique."
        }
    ]
},

{
    "text": "Quel est le nombre estimé d'accidents mortels d'origine électrique en France chaque année ?",
    "answers": [
        {
            "text": "Environ 50",
            "isCorrect": false,
            "comment": "Ce nombre est plus élevé que cela."
        },
        {
            "text": "Environ 200",
            "isCorrect": false,
            "comment": "Ce nombre est encore plus élevé."
        },
        {
            "text": "Environ 1000",
            "isCorrect": false,
            "comment": "Ce nombre est excessivement élevé pour les accidents électriques mortels en France."
        },
        {
            "text": "Environ 100",
            "isCorrect": true,
            "comment": "Environ 100 accidents mortels d'origine électrique sont estimés chaque année en France."
        }
    ]
},

{
    "text": "Quelle est la barrière la plus résistante face au courant électrique ?",
    "answers": [
        {
            "text": "Les nerfs.",
            "isCorrect": false,
            "comment": "Les nerfs ne sont pas une barrière efficace contre le courant électrique."
        },
        {
            "text": "Les vaisseaux sanguins.",
            "isCorrect": false,
            "comment": "Les vaisseaux sanguins ne constituent pas une barrière efficace contre le courant électrique."
        },
        {
            "text": "La peau.",
            "isCorrect": true,
            "comment": "La peau est la barrière la plus résistante face au courant électrique."
        },
        {
            "text": "Le liquide amniotique.",
            "isCorrect": false,
            "comment": "Le liquide amniotique n'est pas une barrière face au courant électrique chez une personne enceinte."
        }
    ]
},

{
    "text": "À quelle intensité de courant électrique commence-t-on à ressentir des picotements ?",
    "answers": [
        {
            "text": "1 mA",
            "isCorrect": true,
            "comment": "À partir d'environ 1 mA, on peut commencer à ressentir des picotements dus au courant électrique."
        },
        {
            "text": "10 mA",
            "isCorrect": false,
            "comment": "Cette intensité est plus élevée que celle à laquelle on commence à ressentir des picotements."
        },
        {
            "text": "30 mA",
            "isCorrect": false,
            "comment": "Cette intensité est encore plus élevée que celle à laquelle on commence à ressentir des picotements."
        },
        {
            "text": "100 mA",
            "isCorrect": false,
            "comment": "Cette intensité est beaucoup plus élevée que celle à laquelle on commence à ressentir des picotements."
        }
    ]
},

{
    "text": "Quels types d'accidents électriques peuvent survenir en France ?",
    "answers": [
        {
            "text": "Uniquement des accidents domestiques.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents domestiques."
        },
        {
            "text": "Accidents du travail, domestiques, de loisirs, dus à des conduites à risque et foudroiement.",
            "isCorrect": true,
            "comment": "Les accidents électriques en France peuvent inclure des accidents du travail, domestiques, de loisirs, dus à des conduites à risque et le foudroiement."
        },
        {
            "text": "Uniquement des accidents liés à des conduites à risque.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents liés à des conduites à risque."
        },
        {
            "text": "Uniquement des accidents de loisirs.",
            "isCorrect": false,
            "comment": "Les accidents électriques en France ne se limitent pas aux accidents de loisirs."
        }
    ]
},

{
    "text": "Qu'est-ce que l'action de secours doit permettre lors d'un accident électrique ?",
    "answers": [
        {
            "text": "Réparer les câbles endommagés.",
            "isCorrect": false,
            "comment": "La réparation des câbles endommagés est une tâche pour les professionnels de l'électricité, pas pour les secouristes."
        },
        {
            "text": "Prendre des photos des blessures.",
            "isCorrect": false,
            "comment": "Prendre des photos des blessures peut être utile à des fins médicales, mais ce n'est pas l'objectif principal de l'action de secours lors d'un accident électrique."
        },
        {
            "text": "Obtenir un avis médical, réaliser les gestes de secours adaptés et prendre en charge les brûlures.",
            "isCorrect": true,
            "comment": "L'action de secours lors d'un accident électrique doit permettre d'obtenir un avis médical, de réaliser les gestes de secours adaptés et de prendre en charge les brûlures."
        },
        {
            "text": "Aucune des réponses précédentes.",
            "isCorrect": false,
            "comment": "La dernière option est incorrecte car l'action de secours doit comprendre plusieurs mesures pour aider la victime."
        }
    ]
},


{
    "text": "Que doit faire un intervenant secouriste lorsqu'une victime est en contact avec un conducteur endommagé ?",
    "answers": [
        {
            "text": "S'approcher immédiatement de la victime.",
            "isCorrect": false,
            "comment": "S'approcher immédiatement de la victime peut mettre en danger l'intervenant lui-même en cas de danger électrique."
        },
        {
            "text": "Couper le courant si possible.",
            "isCorrect": true,
            "comment": "La première action à entreprendre est de couper le courant si cela est possible pour sécuriser la zone et éviter de nouvelles victimes."
        },
        {
            "text": "Toucher la victime pour vérifier si elle est consciente.",
            "isCorrect": false,
            "comment": "Toucher la victime sans avoir sécurisé la zone peut être dangereux en cas de danger électrique."
        },
        {
            "text": "Prendre des photos de la scène.",
            "isCorrect": false,
            "comment": "Prendre des photos de la scène peut être utile à des fins d'enquête ou de documentation, mais cela ne doit pas être la priorité lorsqu'une victime est en contact avec un conducteur endommagé."
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
