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
    "text": "Qu'est-ce qu'un état de crise ?",
    "answers": [
        {
            "text": "Une réaction brusque et intense, de durée limitée, générant une souffrance aiguë difficile à contenir",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Une manifestation contrôlée et régulière",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Une réaction progressive et stable face à un événement traumatisant",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Une condition permanente de détresse psychologique",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quelles peuvent être les origines des troubles entraînant un état de crise ?",
    "answers": [

        {
            "text": "Uniquement des facteurs psychologiques",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des facteurs physiques, psychologiques ou psychiatriques",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Uniquement des facteurs physiques",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des facteurs génétiques et héréditaires",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Qu'est-ce qui peut être considéré comme un facteur déclencheur externe d'un état de crise ?",
    "answers": [
        
        {
            "text": "Un changement interne à la personne",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Une affection psychiatrique permanente",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Un événement stressant, potentiellement traumatisant, exposant soudainement la personne à une menace de mort",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Une réaction aiguë de la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quels sont les signes et manifestations qui peuvent indiquer un état de crise chez une personne ?",
    "answers": [
        
        {
            "text": "Seulement des signes physiques visibles",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Seulement des signes émotionnels intenses",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des signes qui ne peuvent être observés que par des professionnels de santé",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
        {
            "text": "Des signes et manifestations repérables dans différentes sphères : comportementales, émotionnelles et cognitives",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
    ]
},
{
    "text": "Comment peut réagir une victime en état de crise ?",
    "answers": [
        {
            "text": "Elle peut présenter une réaction de fuite panique ou une agitation désordonnée",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Elle reste calme et posée, évaluant calmement la situation",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Elle est souvent incapable de bouger ou de parler",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Elle est parfaitement consciente de la réalité de la situation et prend des décisions rationnelles",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quels sont les signes indiquant un état de panique chez une personne ?",
    "answers": [
       
        {
            "text": "Une capacité à raisonner calmement",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Une tension nerveuse avec apparition d'anxiété et d'agitation psychomotrice",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Une réaction de recul par rapport à la situation",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Une expression calme et posée",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quels sont les signes d'alerte indiquant un passage à l'acte violent ?",
    "answers": [
        
        {
            "text": "Respiration profonde et régulière",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Sourire et contact visuel apaisant",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Pâleur, augmentation de la coloration du visage, agitation",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Immobilité et silence",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quelle est la conduite à tenir spécifique face à un geste violent ?",
    "answers": [
       
        {
            "text": "Utiliser des gestes violents pour se défendre",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Ignorer la personne agressive jusqu'à ce qu'elle se calme",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Laisser la personne agressive seule pour qu'elle se calme d'elle-même",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
        {
            "text": "Évaluer la dangerosité de la situation et mettre en sécurité les objets potentiellement dangereux",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
    ]
},
{
    "text": "Comment devrait être l'abord relationnel avec une personne agressive ?",
    "answers": [
        {
            "text": "Garder une distance de sécurité et rester calme et respectueux",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Adopter une attitude agressive pour montrer de la fermeté",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Éviter tout contact verbal pour ne pas aggraver la situation",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Ignorer la personne agressive jusqu'à ce qu'elle se calme",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quel est l'objectif principal de l'action de secours en termes de relation avec la victime ?",
    "answers": [
        
        {
            "text": "Éviter toute interaction avec la victime pour des raisons de sécurité",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Identifier les réactions inhabituelles et protéger la victime et son entourage",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Réaliser des gestes médicaux complexes dès le début de l'intervention",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Encourager la victime à prendre des décisions autonomes",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Que recherche le secouriste lors de l'observation et de la recherche d'éléments auprès de la victime ?",
    "answers": [
        
        {
            "text": "Uniquement la cause externe de la crise",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des éléments extérieurs perturbants la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Des signes et des caractéristiques spécifiques, ainsi que des informations sur les antécédents, traitements et hospitalisations potentiels",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Des informations sur les antécédents de la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quelle est la première étape pour déterminer les stratégies de protection et de prise en charge de la victime ?",
    "answers": [
        
        {
            "text": "Demander immédiatement l'intervention des forces de l'ordre",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Établir un contact verbal avec la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Stabiliser l'état de crise de la victime",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
        {
            "text": "Identifier les risques potentiels dans l'environnement",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
    ]
},
{
    "text": "Comment le secouriste devrait-il aborder une victime présentant une réaction de type hypoactive (silencieuse) ?",
    "answers": [
        {
            "text": "En cherchant à l'orienter vers des éléments sécurisants et des tâches simples",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "En s'exprimant de manière bruyante pour attirer son attention",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "En lui demandant de s'exprimer émotionnellement sur la situation",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "En lui proposant de réaliser des activités physiques pour la stimuler",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quel est le premier pas à prendre face à une personne en crise suicidaire ?",
    "answers": [
        {
            "text": "Ignorer la situation et la laisser seule.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Reconnaître la souffrance de la personne et aborder la situation avec tact.",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Agir de façon agressive pour la secouer.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Demander à d'autres personnes de s'en occuper.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Quelle est la meilleure façon d'évaluer le risque de passage à l'acte suicidaire ?",
    "answers": [
        {
            "text": "Poser des questions indirectes pour ne pas déranger la personne.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Ne pas aborder le sujet du tout pour ne pas aggraver la situation.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Poser des questions directes pour évaluer le moyen envisagé et sa disponibilité.",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Proposer simplement à la personne de prendre des médicaments pour se calmer.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Que faut-il proposer systématiquement à une personne en crise suicidaire ?",
    "answers": [
        {
            "text": "Une intervention agressive pour la secouer.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "L'abandonner et la laisser seule.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Le transport vers l'hôpital pour une évaluation spécialisée.",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Ignorer ses propos et changer de sujet.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Pourquoi est-il important de surveiller la personne en crise suicidaire pendant toute l'intervention ?",
    "answers": [
        {
            "text": "Pour la juger et la critiquer en cas de geste impulsif.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Pour prévenir tout passage à l'acte impulsif.",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Pour l'ignorer et la laisser seule.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Pour minimiser ses propos et ses émotions.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        }
    ]
},
{
    "text": "Que faut-il rapporter à l'hôpital concernant une personne en crise suicidaire ?",
    "answers": [
        {
            "text": "Aucune information n'est nécessaire.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Les éléments observés et repérés lors de la prise en charge de la personne.",
            "isCorrect": true,
            "comment": "Réponse correcte."
        },
        {
            "text": "Rien, il suffit de laisser la personne seule.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
        },
        {
            "text": "Les éléments médicaux uniquement.",
            "isCorrect": false,
            "comment": "Ce n'est pas la bonne réponse."
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
